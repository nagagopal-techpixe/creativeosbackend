import express from "express";
import {
  // TABS
  getTabs,
  patchTab,
  toggleTabSection,

  // CATEGORIES
  getCategories,
  toggleCategoryGroup,
  toggleCategoryItem,
  toggleCategorySection,

  // RECENT GENERATIONS
  getRecentGenerations,
  patchRecentGeneration,
  toggleRecentSection,

  // TYPES
  getTypes,
  patchType,
  toggleTypeSection,

  // STYLES
  getStyles,
  patchStyle,
  toggleStyleSection,

  // RATIOS
  getRatios,
  patchRatio,
  toggleRatioSection,

  // DETAILS
  getDetails,
  toggleDetailGroup,
  toggleDetailOpt,
  toggleDetailSection,

  // PRESETS
  getPresets,
  togglePresetSection

} from "../controllers/images/imageBuilder.js";

import { protectAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();
router.use(protectAdmin);

//
// TABS
//
router.get("/tabs", getTabs);
router.patch("/tabs/:itemId", patchTab);
router.patch("/tabs/toggle", toggleTabSection);

//
// CATEGORIES (GROUP + ITEMS)
//
router.get("/categories", getCategories);

// toggle whole section
router.patch("/categories/toggle", toggleCategorySection);

// toggle group
router.patch("/categories/group/:groupId/toggle", toggleCategoryGroup);

// toggle item inside group
router.patch("/categories/group/:groupId/item/:itemId/toggle", toggleCategoryItem);

//
// RECENT GENERATIONS
//
router.get("/recent-generations", getRecentGenerations);
router.patch("/recent-generations/:itemId", patchRecentGeneration);
router.patch("/recent-generations/toggle", toggleRecentSection);

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
// RATIOS
//
router.get("/ratios", getRatios);
router.patch("/ratios/toggle", toggleRatioSection);
router.patch("/ratios/:itemId", patchRatio);


//
// DETAILS (GROUP + OPTS)
//
router.get("/details", getDetails);

// toggle section
router.patch("/details/toggle", toggleDetailSection);

// toggle group
router.patch("/details/group/:groupId/toggle", toggleDetailGroup);

// toggle opt
router.patch("/details/group/:groupId/opt/:optId/toggle", toggleDetailOpt);

//
// PRESETS
//
router.get("/presets", getPresets);
router.patch("/presets/toggle", togglePresetSection);

export default router;