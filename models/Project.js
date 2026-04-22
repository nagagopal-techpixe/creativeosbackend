import mongoose from "mongoose";

const artifactSchema = new mongoose.Schema(
  { data: String, type: String },
  { _id: false }
);

const nodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, default: "generic" },

    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },

    width:  { type: Number, default: 280 },
    height: { type: Number, default: 420 },

    data: {
      class_type:       { type: String, default: "" },
      label:            { type: String },
      model_attributes: { type: mongoose.Schema.Types.Mixed },
      params:           { type: mongoose.Schema.Types.Mixed, default: {} },
      _artifacts:       { type: [artifactSchema], default: [] },

      // Only store a real ObjectId — undefined is fine, bad strings are not
      modelId: {
        type:    mongoose.Schema.Types.ObjectId,
        ref:     "Models",
        default: undefined,
      },
    },
  },
  { _id: false }
);

const edgeSchema = new mongoose.Schema(
  {
    id:         { type: String, required: true },
    source:     { type: String, required: true },
    sourcePort: { type: String, default: "output" },
    target:     { type: String, required: true },
    targetPort: { type: String, default: "input" },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Untitled Project" },

    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },

    canvas_state: {
      nodes: { type: [nodeSchema], default: [] },
      edges: { type: [edgeSchema], default: [] },
    },
  },
  { timestamps: true }
);

projectSchema.index({ userId: 1 });

export default mongoose.model("Project", projectSchema);