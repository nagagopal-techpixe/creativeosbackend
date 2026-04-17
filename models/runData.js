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
        userId: {                                          // ← add this
            type: mongoose.Schema.Types.ObjectId,
            ref:  "User",
        },
        projectId: {                                       // ← add this
            type: mongoose.Schema.Types.ObjectId,
            ref:  "Project",
        },
    },
    { timestamps: true }
);
// fast lookup
runDataSchema.index({ projectId: 1 });
runDataSchema.index({ userId: 1 });

const RunData = mongoose.model("RunData", runDataSchema);
export default RunData;