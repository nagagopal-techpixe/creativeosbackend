import Project from '../../models/Project.js';
import Model from '../../models/models.js';
import { runModelAdapter } from '../../adapters/index.js';


export const runnodes = async (req, res) => {
    try {
        const { projectid, nodeid } = req.body;
        if (!projectid) {
            return res.status(400).json({
                success: false,
                statuscode: 400,
                message: "Projectid is required"
            });
        }

        if (projectid && nodeid) {
            const getproject_details = await Project.findById(projectid);

            if (!getproject_details) {
                return res.status(404).json({
                    success: false,
                    statuscode: 404,
                    message: "Project not found"
                });
            }

            // Find the specific node in the canvas_state.nodes array
            let node = getproject_details.canvas_state.nodes.find(n => n.id === nodeid);

            if (!node) {
                return res.status(404).json({
                    success: false,
                    statuscode: 404,
                    message: "Node not found in project"
                });
            }

            const inputs = node.data.model_attributes || [];
            let content = [];
            let directInput = {}; // ✅ for integers, floats, strings like system_prompt

            for (let i = 0; i < inputs.length; i++) {
                const attr = inputs[i];
                if (!attr) continue;



                if ((attr.dtype === "string" || attr.dtype === "array") && (attr.name === "prompt" || attr.name === "messages")) {
                    if (attr.value) {
                        content.push({
                            type: "text",
                            text: attr.value
                        });
                    }

                    if (attr.connectedFrom) {
                        const connections = Array.isArray(attr.connectedFrom) ? attr.connectedFrom : [attr.connectedFrom];

                        for (const conn of connections) {
                            const connectedNodeId = conn.nodeId;
                            if (!connectedNodeId) continue;

                            const connectedNode = getproject_details.canvas_state.nodes.find(n => n.id === connectedNodeId);
                            const artifacts = connectedNode?.data?._artifacts;
                            if (artifacts && artifacts.length > 0) {
                                const lastArtifact = artifacts[artifacts.length - 1];
                                const data = lastArtifact.url || lastArtifact.data;
                                if (data) {
                                    content.push({
                                        type: "text",
                                        text: data
                                    });
                                }
                            }
                        }
                    }
                }

                else if (attr.dtype === "image" || attr.name === "image_input" || attr.dtype === "image_url") {
                    // Check direct value if present
                    if (attr.value) {
                        content.push({
                            type: "image_url",
                            image_url: { url: attr.value }
                        });
                    }

                    if (attr.connectedFrom) {
                        const connections = Array.isArray(attr.connectedFrom) ? attr.connectedFrom : [attr.connectedFrom];

                        for (const conn of connections) {
                            const connectedNodeId = conn.nodeId;
                            if (!connectedNodeId) continue;

                            const connectedNode = getproject_details.canvas_state.nodes.find(n => n.id === connectedNodeId);
                            let imageUrl = connectedNode?.data?.params?.source;

                            const artifacts = connectedNode?.data?._artifacts;
                            if (!imageUrl && artifacts && artifacts.length > 0) {
                                const lastArtifact = artifacts[artifacts.length - 1];
                                imageUrl = lastArtifact.url || lastArtifact.data;
                            }

                            if (imageUrl) {
                                content.push({
                                    type: "image_url",
                                    image_url: { url: imageUrl }
                                });
                            }
                        }
                    }
                }

                else if (attr.dtype === "integer") {
                    directInput[attr.name] = parseInt(attr.value);
                }
                else if (attr.dtype === "float") {
                    directInput[attr.name] = parseFloat(attr.value);
                }
                else if (attr.dtype === "boolean") {
                    directInput[attr.name] = (attr.value === "true" || attr.value === true);
                }
                else if (attr.dtype === "string" || attr.dtype === "array") {
                    directInput[attr.name] = attr.value;
                }
            }


            //console.log(content)

            let messages = [{
                role: "user",
                content
            }];

            // ✅ Final input — messages + all direct fields together
            const finalInput = {
                messages,
                ...directInput
            };

            //getmodel details of that node
            const modelid = node.data.modelId
            const getmodel = await Model.findById(modelid)

            if (!getmodel) {
                return res.status(404).json({
                    success: false,
                    statuscode: 404,
                    message: "modelid is missing in the node data or model is not found"
                })
            }

            console.log("Final Input to Adapter:", JSON.stringify(finalInput, null, 2));
            // Call the AI model adapter
            const response = await runModelAdapter(getmodel, finalInput);

            if (response) {
                // Find the node index to ensure we are modifying the document correctly
                const nodeIndex = getproject_details.canvas_state.nodes.findIndex(n => n.id === nodeid);

                if (nodeIndex !== -1) {
                    // Initialize data and _artifacts if they don't exist
                    if (!getproject_details.canvas_state.nodes[nodeIndex].data) {
                        getproject_details.canvas_state.nodes[nodeIndex].data = {};
                    }
                    if (!getproject_details.canvas_state.nodes[nodeIndex].data._artifacts) {
                        getproject_details.canvas_state.nodes[nodeIndex].data._artifacts = [];
                    }

                    // Push the new artifact
                    getproject_details.canvas_state.nodes[nodeIndex].data._artifacts.push({
                        type: "text",
                        data: typeof response === 'string' ? response : JSON.stringify(response)
                    });

                    // Explicitly mark the path as modified to ensure Mongoose saves the nested change
                    getproject_details.markModified('canvas_state.nodes');
                    await getproject_details.save();
                }
            }

            return res.status(200).json({
                success: true,
                message: "AI Execution Successful",
                data: response
            });
        } else if (projectid) {
            const project_details = await Project.findById(projectid)

            if (!project_details) {
                return res.status(404).json({
                    success: false,
                    statuscode: 404,
                    message: "Project not found"
                })
            }

            const nodes = project_details.canvas_state.nodes
            const SKIP_TYPES = ["LoadImage", "LoadVideo", "LoadAudio"];
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i]
                if (SKIP_TYPES.includes(node.data.class_type)) continue
                const inputs = node.data.model_attributes || []
                let content = []
                let directInput = {}

                for (let j = 0; j < inputs.length; j++) {
                    const attr = inputs[j];
                    if (!attr) continue;



                    if ((attr.dtype === "string" || attr.dtype === "array") && (attr.name === "prompt" || attr.name === "messages")) {
                        if (attr.value) {
                            content.push({
                                type: "text",
                                text: attr.value
                            });
                        }

                        if (attr.connectedFrom) {
                            const connections = Array.isArray(attr.connectedFrom) ? attr.connectedFrom : [attr.connectedFrom];

                            for (const conn of connections) {
                                const connectedNodeId = conn.nodeId;
                                if (!connectedNodeId) continue;

                                const connectedNode = project_details.canvas_state.nodes.find(n => n.id === connectedNodeId);
                                const artifacts = connectedNode?.data?._artifacts;
                                if (artifacts && artifacts.length > 0) {
                                    const lastArtifact = artifacts[artifacts.length - 1];
                                    const data = lastArtifact.url || lastArtifact.data;
                                    if (data) {
                                        content.push({
                                            type: "text",
                                            text: data
                                        });
                                    }
                                }
                            }
                        }
                    }
                    else if (attr.dtype === "image" || attr.name === "image_input" || attr.dtype === "image_url") {
                        if (attr.value) {
                            content.push({
                                type: "image_url",
                                image_url: { url: attr.value }
                            });
                        }

                        if (attr.connectedFrom) {
                            const connections = Array.isArray(attr.connectedFrom) ? attr.connectedFrom : [attr.connectedFrom];

                            for (const conn of connections) {
                                const connectedNodeId = conn.nodeId;
                                if (!connectedNodeId) continue;

                                const connectedNode = project_details.canvas_state.nodes.find(n => n.id === connectedNodeId);
                                let image_url = connectedNode?.data?.params?.source;

                                const artifacts = connectedNode?.data?._artifacts;
                                if (!image_url && artifacts && artifacts.length > 0) {
                                    const lastArtifact = artifacts[artifacts.length - 1];
                                    image_url = lastArtifact.url || lastArtifact.data;
                                }

                                if (image_url) {
                                    content.push({
                                        type: "image_url",
                                        image_url: { url: image_url }
                                    });
                                }
                            }
                        }
                    }

                    else if (attr.dtype === "integer") {
                        directInput[attr.name] = parseInt(attr.value);
                    }
                    else if (attr.dtype === "float") {
                        directInput[attr.name] = parseFloat(attr.value);
                    }
                    else if (attr.dtype === "boolean") {
                        directInput[attr.name] = (attr.value === "true" || attr.value === true);
                    }
                    else if (attr.dtype === "string" || attr.dtype === "array") {
                        directInput[attr.name] = attr.value;
                    }

                }

                let messages = [{
                    role: "user",
                    content
                }]

                const finalInput = {
                    messages,
                    ...directInput
                }

                const modelid = node.data.modelId
                const getmodel = await Model.findById(modelid)

                if (!getmodel) {
                    continue; // Skip nodes with missing models in batch run, or handle as error
                }

                const response = await runModelAdapter(getmodel, finalInput)

                if (response) {
                    const nodeIndex = project_details.canvas_state.nodes.findIndex(n => n.id === node.id);

                    if (nodeIndex !== -1) {
                        if (!project_details.canvas_state.nodes[nodeIndex].data) {
                            project_details.canvas_state.nodes[nodeIndex].data = {}
                        }
                        if (!project_details.canvas_state.nodes[nodeIndex].data._artifacts) {
                            project_details.canvas_state.nodes[nodeIndex].data._artifacts = [];
                        }

                        project_details.canvas_state.nodes[nodeIndex].data._artifacts.push({
                            type: "text",
                            data: typeof response === 'string' ? response : JSON.stringify(response)
                        });

                        // Explicitly mark the path as modified to ensure Mongoose saves the nested change
                        project_details.markModified('canvas_state.nodes');
                        await project_details.save();
                    }
                }
            }

            return res.status(200).json({
                success: true,
                message: "Project nodes executed successfully"
            });

        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            statuscode: 500,
            message: "internal Server Error",
            error: error.message
        })
    }
}