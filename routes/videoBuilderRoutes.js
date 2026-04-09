import express from "express";
import {
  getTypes,         patchType,         toggleTypeSection,
  getStyles,        patchStyle,         toggleStyleSection,
  getDurations,     patchDuration,      toggleDurationSection,
  getFormats,       patchFormat,        toggleFormatSection,
  getHooks,         patchHook,          toggleHookSection,
  getDetails,       toggleDetailGroup,  toggleDetailOpt,   toggleDetailSection,
  getPresets,       togglePresetSection,
} from "../controllers/videobuilder/videoBuilderController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();
router.use(protectAdmin);

// ── TYPES 
router.get("/types",                          getTypes);
router.patch("/types/toggle",                 toggleTypeSection);
router.patch("/types/item/:itemId",           patchType);

// ── STYLES 
router.get("/styles",                         getStyles);
router.patch("/styles/toggle",                toggleStyleSection);
router.patch("/styles/item/:itemId",          patchStyle);

// ── DURATIONS
router.get("/durations",                      getDurations);
router.patch("/durations/toggle",             toggleDurationSection);
router.patch("/durations/item/:itemId",       patchDuration);

// ── FORMATS 
router.get("/formats",                        getFormats);
router.patch("/formats/toggle",               toggleFormatSection);
router.patch("/formats/item/:itemId",         patchFormat);

// ── HOOKS 
router.get("/hooks",                          getHooks);
router.patch("/hooks/toggle",                 toggleHookSection);
router.patch("/hooks/item/:itemId",           patchHook);

// ── DETAILS 
router.get("/details",                                          getDetails);
router.patch("/details/toggle",                                 toggleDetailSection);
router.patch("/details/group/:groupId/toggle",                  toggleDetailGroup);
router.patch("/details/group/:groupId/opt/:optId/toggle",       toggleDetailOpt);

// ── PRESETS 
router.get("/presets",                        getPresets);
router.patch("/presets/toggle",               togglePresetSection);

export default router;