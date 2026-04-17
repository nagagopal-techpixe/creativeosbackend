import express from "express";
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProjectName,
    saveCanvasState,
    deleteProject
} from "../controllers/project/project.js";
import { protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// all project routes are protected
router.post("/",                        protectUser, createProject);
router.get("/",                         protectUser, getAllProjects);
router.get("/:id",                      protectUser, getProjectById);
router.patch("/:id/name",               protectUser, updateProjectName);
router.patch("/:id/canvas",             protectUser, saveCanvasState);
router.delete("/:id",                   protectUser, deleteProject);

export default router;