import Category from "../models/categories.js"

export const createcategory = async (req,res) => {
    try{

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
            statuscode: 500
        })
    }
}