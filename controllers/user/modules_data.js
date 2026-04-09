import Users from "../../models/Usermodel/User.js" 
import { getBuilderData } from "../../middleware/helper.js";

export const getmodulepermissions = async(req,res) => {
    try{
        const user = await Users.findById(req.user._id) 
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
                statuscode: 404
            })
        }
        
        console.log('Request body:', req.body);
        const buildername = req.body.buildername;
        console.log('Extracted buildername:', buildername);
        
        if (!buildername) {
            return res.status(400).json({
                success: false,
                message: "Builder name is required in request body",
                statuscode: 400
            });
        }
        
        // Create a mock request object for the helper function
        const mockReq = {
            user: { _id: req.user._id },
            params: { builderName: buildername }
        };
        console.log('Mock request created:', mockReq);
        
        // Call the helper function - it will handle the response
        console.log('Calling getBuilderData...');
        await getBuilderData(mockReq, res);
        
    }catch(error){
        console.error('Error in getmodulepermissions:', error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
                statuscode: 500
            })
        }
    }
}


