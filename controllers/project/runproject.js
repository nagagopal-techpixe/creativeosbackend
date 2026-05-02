import Project from "../../models/Project.js";
import Model from "../../models/models.js";
import { runModelAdapter } from "../../adapters/index.js";
import { uploadToS3 } from "../../utils/s3Upload.js";

async function saveToS3(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return url;

    const buffer = Buffer.from(await res.arrayBuffer());
    const ext =
      url.match(/\.(mp4|webm|mov|jpg|jpeg|png|webp|wav|mp3|ogg)/i)?.[1] ||
      "mp4";
    const mimeType = ext.match(/mp4|webm|mov/)
      ? `video/${ext}`
      : ext.match(/jpg|jpeg/)
        ? "image/jpeg"
        : ext.match(/png/)
          ? "image/png"
          : ext.match(/webp/)
            ? "image/webp"
            : ext.match(/wav/)
              ? "audio/wav"
              : ext.match(/mp3/)
                ? "audio/mpeg"
                : "audio/ogg";
    const folder = ext.match(/mp4|webm|mov/)
      ? "videos"
      : ext.match(/jpg|jpeg|png|webp/)
        ? "images"
        : "audio";

    //  Use your existing uploadToS3
    const s3Url = await uploadToS3(buffer, `output.${ext}`, mimeType, folder);
    console.log("Saved to S3:", s3Url);
    return s3Url;
  } catch (err) {
    console.error("S3 save failed:", err);
    return url; // fallback to original URL
  }
}
export const runnodes = async (req, res) => {
  try {
    const { projectid, nodeid } = req.body;
    if (!projectid) {
      return res.status(400).json({
        success: false,
        statuscode: 400,
        message: "Projectid is required",
      });
    }

    if (projectid && nodeid) {
      const getproject_details = await Project.findById(projectid);

      if (!getproject_details) {
        return res.status(404).json({
          success: false,
          statuscode: 404,
          message: "Project not found",
        });
      }

      // Find the specific node in the canvas_state.nodes array
      let node = getproject_details.canvas_state.nodes.find(
        (n) => n.id === nodeid,
      );

      if (!node) {
        return res.status(404).json({
          success: false,
          statuscode: 404,
          message: "Node not found in project",
        });
      }

      const inputs = node.data.model_attributes || [];
      let content = [];
      let directInput = {}; //  for integers, floats, strings like system_prompt

      for (let i = 0; i < inputs.length; i++) {
        const attr = inputs[i];
        if (!attr) continue;

        let resolvedValue = null;
        if (attr.connectedFrom) {
          const connections = Array.isArray(attr.connectedFrom)
            ? attr.connectedFrom
            : [attr.connectedFrom];
          for (const conn of connections) {
            const connectedNodeId = conn.nodeId;
            if (!connectedNodeId) continue;
            const connectedNode = getproject_details.canvas_state.nodes.find(
              (n) => n.id === connectedNodeId,
            );
            const artifacts = connectedNode?.data?._artifacts;
            if (artifacts && artifacts.length > 0) {
              const lastArtifact = artifacts[artifacts.length - 1];
              resolvedValue = lastArtifact.url || lastArtifact.data;
            } else {
              resolvedValue = connectedNode?.data?.params?.source || connectedNode?.data?.value;
            }
          }
        }

        const finalValue = resolvedValue ?? attr.value;
        if (finalValue === undefined || finalValue === null) continue;

        // 1. Add to multimodal content array (for broad compatibility)
        if (attr.dtype === "image" || attr.dtype === "image_url" || attr.name === "image_input") {
          content.push({ type: "image_url", image_url: { url: String(finalValue) } });
        } else if (attr.name === "prompt" || attr.name === "messages" || attr.dtype === "string") {
          content.push({ type: "text", text: String(finalValue) });
        }

        // 2. Add to directInput (preserve the EXACT attribute name for models that need it)
        if (attr.name !== "messages") {
          if (attr.dtype === "integer") {
            directInput[attr.name] = parseInt(finalValue);
          } else if (attr.dtype === "float") {
            directInput[attr.name] = parseFloat(finalValue);
          } else if (attr.dtype === "boolean") {
            directInput[attr.name] = finalValue === "true" || finalValue === true;
          } else {
            directInput[attr.name] = finalValue;
          }
        }
      }

      //console.log(content)

      let messages = [
        {
          role: "user",
          content,
        },
      ];

      //  Final input — messages + all direct fields together
      const finalInput = {
        messages,
        ...directInput,
      };

      //getmodel details of that node
      const modelid = node.data.modelId;
      const getmodel = await Model.findById(modelid);

      if (!getmodel) {
        return res.status(404).json({
          success: false,
          statuscode: 404,
          message: "modelid is missing in the node data or model is not found",
        });
      }

      console.log(
        "Final Input to Adapter:",
        JSON.stringify(finalInput, null, 2),
      );
      // Call the AI model adapter
      //  New
      const response = await runModelAdapter(getmodel, finalInput);

      // Save to S3 if replicate URL
      let finalResponse = response;
      if (
        typeof response === "string" &&
        response.includes("replicate.delivery")
      ) {
        finalResponse = await saveToS3(response);
      }

      if (finalResponse) {
        const nodeIndex = getproject_details.canvas_state.nodes.findIndex(
          (n) => n.id === nodeid,
        );

        if (nodeIndex !== -1) {
          if (!getproject_details.canvas_state.nodes[nodeIndex].data) {
            getproject_details.canvas_state.nodes[nodeIndex].data = {};
          }
          if (
            !getproject_details.canvas_state.nodes[nodeIndex].data._artifacts
          ) {
            getproject_details.canvas_state.nodes[nodeIndex].data._artifacts =
              [];
          }

          const responseData =
            typeof finalResponse === "string"
              ? finalResponse
              : JSON.stringify(finalResponse);
          const artifactType = responseData.match(/\.(mp4|webm|mov)/i)
            ? "video"
            : responseData.match(/\.(jpg|jpeg|png|webp)/i)
              ? "image"
              : responseData.match(/\.(wav|mp3|ogg|aac)/i)
                ? "audio"
                : "text";
          getproject_details.canvas_state.nodes[nodeIndex].data._artifacts = [];
          getproject_details.canvas_state.nodes[nodeIndex].data._artifacts.push(
            {
              type: artifactType,
              data: responseData,
            },
          );

          getproject_details.markModified("canvas_state.nodes");
          await getproject_details.save();
        }
      }

      return res.status(200).json({
        success: true,
        message: "AI Execution Successful",
        data: finalResponse, // ← changed
      });
    } else if (projectid) {
      const project_details = await Project.findById(projectid);

      if (!project_details) {
        return res.status(404).json({
          success: false,
          statuscode: 404,
          message: "Project not found",
        });
      }

      const nodes = project_details.canvas_state.nodes;
      const SKIP_TYPES = ["LoadImage", "LoadVideo", "LoadAudio"];
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (SKIP_TYPES.includes(node.data.class_type)) continue;
        const inputs = node.data.model_attributes || [];
        let content = [];
        let directInput = {};

        for (let j = 0; j < inputs.length; j++) {
          const attr = inputs[j];
          if (!attr) continue;

          let resolvedValue = null;
          if (attr.connectedFrom) {
            const connections = Array.isArray(attr.connectedFrom)
              ? attr.connectedFrom
              : [attr.connectedFrom];
            for (const conn of connections) {
              const connectedNodeId = conn.nodeId;
              if (!connectedNodeId) continue;
              const connectedNode = project_details.canvas_state.nodes.find(
                (n) => n.id === connectedNodeId,
              );
              const artifacts = connectedNode?.data?._artifacts;
              if (artifacts && artifacts.length > 0) {
                const lastArtifact = artifacts[artifacts.length - 1];
                resolvedValue = lastArtifact.url || lastArtifact.data;
              } else {
                resolvedValue = connectedNode?.data?.params?.source || connectedNode?.data?.value;
              }
            }
          }

          const finalValue = resolvedValue ?? attr.value;
          if (finalValue === undefined || finalValue === null) continue;

          // 1. Multimodal
          if (attr.dtype === "image" || attr.dtype === "image_url" || attr.name === "image_input") {
            content.push({ type: "image_url", image_url: { url: String(finalValue) } });
          } else if (attr.name === "prompt" || attr.name === "messages" || attr.dtype === "string") {
            content.push({ type: "text", text: String(finalValue) });
          }

          // 2. Direct
          if (attr.name !== "messages") {
            if (attr.dtype === "integer") {
              directInput[attr.name] = parseInt(finalValue);
            } else if (attr.dtype === "float") {
              directInput[attr.name] = parseFloat(finalValue);
            } else if (attr.dtype === "boolean") {
              directInput[attr.name] = finalValue === "true" || finalValue === true;
            } else {
              directInput[attr.name] = finalValue;
            }
          }
        }

        let messages = [
          {
            role: "user",
            content,
          },
        ];

        const finalInput = {
          messages,
          ...directInput,
        };

        const modelid = node.data.modelId;
        const getmodel = await Model.findById(modelid);

        if (!getmodel) {
          continue; // Skip nodes with missing models in batch run, or handle as error
        }

        const response = await runModelAdapter(getmodel, finalInput);

        if (response) {
          const nodeIndex = project_details.canvas_state.nodes.findIndex(
            (n) => n.id === node.id,
          );

          if (nodeIndex !== -1) {
            if (!project_details.canvas_state.nodes[nodeIndex].data) {
              project_details.canvas_state.nodes[nodeIndex].data = {};
            }
            if (
              !project_details.canvas_state.nodes[nodeIndex].data._artifacts
            ) {
              project_details.canvas_state.nodes[nodeIndex].data._artifacts =
                [];
            }

            const responseData =
              typeof response === "string"
                ? response
                : JSON.stringify(response);
            const artifactType = responseData.match(/\.(mp4|webm|mov)/i)
              ? "video"
              : responseData.match(/\.(jpg|jpeg|png|webp)/i)
                ? "image"
                : responseData.match(/\.(wav|mp3|ogg|aac)/i)
                  ? "audio"
                  : "text";
            project_details.canvas_state.nodes[nodeIndex].data._artifacts = [];
            project_details.canvas_state.nodes[nodeIndex].data._artifacts.push({
              type: artifactType,
              data: responseData,
            });

            // Explicitly mark the path as modified to ensure Mongoose saves the nested change
            project_details.markModified("canvas_state.nodes");
            await project_details.save();
          }
        }
      }

      return res.status(200).json({
        success: true,
        message: "Project nodes executed successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      statuscode: 500,
      message: "internal Server Error",
      error: error.message,
    });
  }
};
