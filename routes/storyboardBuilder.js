import express from "express";
import {
  getTypes, patchType, toggleTypeSection,
  getStyles, patchStyle, toggleStyleSection,
  getFrames, patchFrame, toggleFrameSection,
  getRatios, patchRatio, toggleRatioSection,
  getDetails, toggleDetailGroup, toggleDetailOpt, toggleDetailSection,
  getPresets, togglePresetSection
} from "../controllers/storyboard/storyboardBuilder.js";

import { protectAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();
router.use(protectAdmin);

//
// TYPES
//
router.get("/types", getTypes);
router.patch("/types/toggle", toggleTypeSection);
router.patch("/types/:itemId", patchType);


//
// STYLES
//
router.get("/styles", getStyles);
router.patch("/styles/toggle", toggleStyleSection);
router.patch("/styles/:itemId", patchStyle);


//
// FRAMES
//
router.get("/frames", getFrames);
router.patch("/frames/toggle", toggleFrameSection);
router.patch("/frames/:itemId", patchFrame);


//
// RATIOS
//
router.get("/ratios", getRatios);
router.patch("/ratios/toggle", toggleRatioSection);
router.patch("/ratios/:itemId", patchRatio);


//
// DETAILS
//
router.get("/details", getDetails);
router.patch("/details/toggle", toggleDetailSection);
router.patch("/details/group/:groupId/toggle", toggleDetailGroup);
router.patch("/details/group/:groupId/opt/:optId/toggle", toggleDetailOpt);

//
// PRESETS
//
router.get("/presets", getPresets);
router.patch("/presets/toggle", togglePresetSection);

export default router;