import express from "express";
import {
  // TYPES
  getTypes,
  patchType,
  toggleTypeSection,

  // STYLES
  getStyles,
  patchStyle,
  toggleStyleSection,

  // POSES
  getPoses,
  patchPose,
  togglePoseSection,

  // DETAILS
  getDetails,
  toggleDetailGroup,
  toggleDetailOpt,
  toggleDetailSection,

  // PRESETS
  getPresets,
  togglePresetSection

} from "../controllers/character/characterBuilder.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();
router.use(protectAdmin);

//
// TYPES
//
router.get("/types", getTypes);
router.patch("/types/toggle", toggleTypeSection);
router.patch("/types/:itemId", patchType);


// STYLES
router.get("/styles", getStyles);
router.patch("/styles/toggle", toggleStyleSection);
router.patch("/styles/:itemId", patchStyle);


//
// POSES
//
router.get("/poses", getPoses);
router.patch("/poses/toggle", togglePoseSection);
router.patch("/poses/:itemId", patchPose);


// Get all details
router.get("/details", getDetails);

// Toggle entire section
router.patch("/details/toggle", toggleDetailSection);

// Toggle group
router.patch("/details/group/:groupId/toggle", toggleDetailGroup);

// Toggle option inside group
router.patch("/details/group/:groupId/opt/:optId/toggle", toggleDetailOpt);

//
// PRESETS
//
router.get("/presets", getPresets);
router.patch("/presets/toggle", togglePresetSection);

export default router;