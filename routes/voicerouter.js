import express from "express";
import {
  // TYPES
  getTypes,
  patchType,
  toggleTypeSection,

  // TONES
  getTones,
  patchTone,
  toggleToneSection,

  // PACING
  getPacing,
  patchPacing,
  togglePacingSection,

  // PRESETS
  getPresets,
  togglePresetSection

} from "../controllers/voice/voiceBuilder.js";

const router = express.Router();

//
// TYPES
//
router.get("/types", getTypes);
router.patch("/types/toggle", toggleTypeSection);
router.patch("/types/:itemId", patchType);

//
// TONES
//
router.get("/tones", getTones);
router.patch("/tones/toggle", toggleToneSection);
router.patch("/tones/:itemId", patchTone);


//
// PACING
//
    router.get("/pacing", getPacing);
    router.patch("/pacing/toggle", togglePacingSection);
    router.patch("/pacing/:itemId", patchPacing);


//
// PRESETS
//
router.get("/presets", getPresets);
router.patch("/presets/toggle", togglePresetSection);

export default router;