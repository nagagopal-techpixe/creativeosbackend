import mongoose from "mongoose"; 

const image_genration_schema = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name:{
        type: String,
        default: null
    },
    image: {
        type: String
    }
},{
    timestamps: true
}) 

export default mongoose.models.image_genration ||  mongoose.model('image_genration',image_genration_schema)