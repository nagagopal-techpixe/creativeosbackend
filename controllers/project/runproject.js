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
                
                // // USER REQUIREMENT: Include all 6 attributes.
                // // We include them if they have a value or a connection.
                // const hasValue = attr.value !== undefined && attr.value !== null && attr.value !== "";
                // const hasConnection = attr.connectedFrom && (Array.isArray(attr.connectedFrom) ? attr.connectedFrom.length > 0 : true);
                
                // if (!hasValue && !hasConnection) {
                //     console.log(`Skipping attribute ${attr?.name}: no value and no connection`);
                //     continue;
                // }
                // //console.log(`Processing attribute ${attr?.name} (dtype: ${attr?.dtype})`);


                if (attr.dtype === "string" && (attr.name === "prompt" || attr.name === "messages")) {
                    content.push({
                        type: "text",
                        text: attr.value
                    });
                }

                else if (attr.dtype === "image" || attr.name === "image_input" || attr.dtype === "image_url") {
                    if (attr.connectedFrom) {
                        // Handle both single connection object or array of connections
                        const connections = Array.isArray(attr.connectedFrom) ? attr.connectedFrom : [attr.connectedFrom];

                        for (const conn of connections) {
                            const connectedNodeId = conn.nodeId;
                            if (!connectedNodeId) continue;

                            const connectedNode = getproject_details.canvas_state.nodes.find(n => n.id === connectedNodeId);
                            const imageUrl = connectedNode?.data?.params?.source;

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
                else if (attr.dtype === "string") {
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

            //console.log("Final Input to Adapter:", JSON.stringify(finalInput, null, 2));
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