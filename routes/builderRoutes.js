import express from "express";
import { protectUser } from "../middleware/authMiddleware.js";
import {
  getImageTabs, getImageCategories, getBuilderTypes,
  getBuilderStyles, getBuilderDetails, getBuilderRatios,
  getImagePresets, getRecentGenerations,
} from "../controllers/builderController.js";

const router = express.Router();

router.get("/tabs",        protectUser, getImageTabs);
router.get("/categories",  protectUser, getImageCategories);
router.get("/types",       protectUser, getBuilderTypes);
router.get("/styles",      protectUser, getBuilderStyles);
router.get("/details",     protectUser, getBuilderDetails);
router.get("/ratios",      protectUser, getBuilderRatios);
router.get("/presets",     protectUser, getImagePresets);
router.get("/recents",     protectUser, getRecentGenerations);

export default router;