import mongoose from "mongoose"; 

const character_genration_schema = new mongoose.Schema({
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

export default mongoose.models.character_genration ||  mongoose.model('character_genration',character_genration_schema)