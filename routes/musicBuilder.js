import express from "express";
import {
  // TYPES
  getTypes,
  patchType,
  toggleTypeSection,

  // GENRES
  getGenres,
  patchGenre,
  toggleGenreSection,

  // DURATIONS
  getDurations,
  patchDuration,
  toggleDurationSection,

  // DETAILS
  getDetails,
  toggleDetailGroup,
  toggleDetailOpt,
  toggleDetailSection,

  // PRESETS
  getPresets,
  togglePresetSection

} from "../controllers/music/musicBuilder.js";

const router = express.Router();

//
// TYPES
//
router.get("/types", getTypes);
router.patch("/types/toggle", toggleTypeSection);
router.patch("/types/:itemId", patchType);

// GENRES
router.get("/genres", getGenres);
router.patch("/genres/toggle", toggleGenreSection);
router.patch("/genres/:itemId", patchGenre);

// DURATIONS

router.get("/durations", getDurations);
router.patch("/durations/toggle", toggleDurationSection);
router.patch("/durations/:itemId", patchDuration);


// Get all details
router.get("/details", getDetails);
// Toggle entire details section
router.patch("/details/toggle", toggleDetailSection);
// Toggle group
router.patch("/details/group/:groupId/toggle", toggleDetailGroup);
// Toggle option inside group
router.patch("/details/group/:groupId/opt/:optId/toggle", toggleDetailOpt);


// PRESETS

router.get("/presets", getPresets);
router.patch("/presets/toggle", togglePresetSection);

export default router;