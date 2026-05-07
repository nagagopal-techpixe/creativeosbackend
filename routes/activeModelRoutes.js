import express from "express";
import { setActiveModel, getActiveModel } from "../controllers/activeModelController.js";

const router = express.Router();

router.post("/",        setActiveModel);   // admin saves selection
router.get("/:type",    getActiveModel);   // fetch active by type e.g. /image

export default router;