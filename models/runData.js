// models/runData.js
import mongoose from "mongoose";

const runDataSchema = new mongoose.Schema(
    {
        model: {
            type:     mongoose.Schema.Types.ObjectId,
            ref:      "Models",
            required: true,
        },

        inputs: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

const RunData = mongoose.model("RunData", runDataSchema);
export default RunData;