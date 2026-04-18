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
            const node = getproject_details.canvas_state.nodes.find(n => n.id === nodeid);
            
            if (!node) {
                return res.status(404).json({
                    success: false,
                    statuscode: 404,
                    message: "Node not found in project"
                });
            }

            const inputs = node.data.model_attributes || [];
            let content = [];
            
            for (let i = 0; i < inputs.length; i++) {
                const attr = inputs[i];
                if (!attr.isActive || !attr.value) continue;

                if (attr.dtype === "string" || attr.dtype === "text" || attr.name === "prompt") {
                    content.push({ 
                        type: "text", 
                        text: attr.value 
                    });
                } else if (attr.dtype === "image" || attr.name === "image_input" || attr.dtype === "image_url") {
                    content.push({ 
                        type: "image_url", 
                        image_url: { url: attr.value } 
                    });
                }
            }
 
           let messages = [{
              role: "user",
              content
           }]

            //getmodel details of that node
            const modelid = node.data.modelId 
            const getmodel = await Model.findById(modelid) 

            if(!getmodel){
                return res.status(404).json({
                    success: false,
                    statuscode: 404,
                    message: "modelid is missing in the node data or model is not found"
                })
            }

            // Call the AI model adapter
            const response = await runModelAdapter(getmodel, messages);

            return res.status(200).json({
                success: true,
                message: "AI Execution Successful",
                data: response
            });
        }



    }catch(error){
        return res.status(500).json({
            success: false,
            statuscode: 500,
            message: "internal Server Error",
            error: error.message
        })
    }
}