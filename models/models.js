import mongoose from "mongoose";

const modelsSchema = new mongoose.Schema({
    model_name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required: true
    },
   provider: {
    type: String,
    required: true,
    trim: true
},
    link: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    model_attributes: [
        {
            name:     { type: String,  required: true },
            dtype:    { type: String,  required: true },
            value:    { type: String,  default: "" },
            isActive: { type: Boolean, default: true },
             maxCount: { type: Number,  default: null },    
            _id:      false
        }
    ]

}, { timestamps: true });

const Models = mongoose.model('Models', modelsSchema);
export default Models;