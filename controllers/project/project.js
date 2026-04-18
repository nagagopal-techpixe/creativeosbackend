import Project from "../../models/Project.js";

// ─── helpers ─────────────────────────────────────────────────────────────────

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

/** Return a valid 24-char hex ObjectId string, or undefined */
const sanitizeObjectId = (raw) => {
  if (!raw) return undefined;
  const s = String(raw).trim();
  return OBJECT_ID_RE.test(s) ? s : undefined;
};

/** Strip / coerce a raw node object so Mongoose never sees bad types */
const sanitizeNode = (n) => ({
  id:       String(n.id),
  type:     String(n.type || "generic"),
  position: {
    x: Number(n.position?.x ?? 0),
    y: Number(n.position?.y ?? 0),
  },
  width:  Number(n.width  || 280),
  height: Number(n.height || 420),
  data: {
    class_type:       String(n.data?.class_type || ""),
    label:            n.data?.label            ? String(n.data.label) : undefined,
    model_attributes: n.data?.model_attributes ?? undefined,
    params:           typeof n.data?.params === "object" ? n.data.params : {},
    _artifacts: Array.isArray(n.data?._artifacts)
      ? n.data._artifacts.map((a) => ({
          url:  String(a?.url  || ""),
          type: String(a?.type || "image"),
        }))
      : [],
    modelId: sanitizeObjectId(n.data?.modelId),
  },
});

/** Strip / coerce a raw edge object */
const sanitizeEdge = (e) => ({
  id:         String(e.id),
  source:     String(e.source),
  sourcePort: String(e.sourcePort || "output"),
  target:     String(e.target),
  targetPort: String(e.targetPort || "input"),
});

// ─── controllers ──────────────────────────────────────────────────────────────

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      name:         req.body.name || "Untitled Project",
      userId:       req.user._id,
      canvas_state: { nodes: [], edges: [] },
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL PROJECTS
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id })
      .select('name createdAt updatedAt')  // only name + dates, no canvas_state
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE PROJECT
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE NAME
export const updateProjectName = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name: req.body.name },
      { new: true }
    );
    if (!project) return res.status(404).json({ success: false });
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SAVE CANVAS
export const saveCanvasState = async (req, res) => {
  try {
    const { nodes, edges } = req.body;

    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      return res.status(400).json({
        success: false,
        message: "nodes and edges must be arrays",
      });
    }

    // Sanitise every node and edge before touching Mongoose
    const cleanNodes = nodes.map(sanitizeNode);
    const cleanEdges = edges.map(sanitizeEdge);

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { canvas_state: { nodes: cleanNodes, edges: cleanEdges } },
      { new: true, runValidators: true }
    );

    if (!project) return res.status(404).json({ success: false });

    res.json({
      success: true,
      message: "Canvas saved successfully",
      data: project.canvas_state,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ success: false });
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};  