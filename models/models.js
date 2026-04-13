import mongoose from "mongoose" 


const modelsSchema = new mongoose.Schema({
    model_name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    link: {
        type: String,
        required: true
    },
    model_attributes:[
        {
            type: String,
            required: true
        }
    ]
    
},{
    timestamps: true
})
const Models = mongoose.model('Models', modelsSchema)
export default Models