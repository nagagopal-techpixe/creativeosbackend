import express from "express";
import {
  createUser, getUserPermissions, updateUserPermissions,
  getAllUsers, getMyUsers, deleteUser,
  toggleVideoSection, toggleVideoItem,
  toggleVoiceSection, toggleVoiceItem,
  toggleVideoDetailsSection, toggleVideoDetailsGroup, toggleVideoDetailsOpt,
  toggleCharacterSection, toggleCharacterItem,
  toggleCharacterDetailsSection, toggleCharacterDetailsGroup, toggleCharacterDetailsOpt,
  toggleMusicSection, toggleMusicItem,
  toggleMusicDetailsSection, toggleMusicDetailsGroup, toggleMusicDetailsOpt,
  toggleStoryboardSection, toggleStoryboardItem,
  toggleStoryboardDetailsSection, toggleStoryboardDetailsGroup, toggleStoryboardDetailsOpt,
  toggleImageSection, toggleImageItem,                                          // ✅
  toggleImageDetailsSection, toggleImageDetailsGroup, toggleImageDetailsOpt,    // ✅
  toggleImageCategoriesSection, toggleImageCategoriesGroup, toggleImageCategoriesItem, // ✅
} from "../controllers/authController/admin.js";

import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectAdmin);

// ─── USERS
router.post("/users",          createUser);
router.get("/users",           getAllUsers);
router.get("/users/my",        getMyUsers);
router.delete("/users/:id",    deleteUser);
router.get("/users/:id/permissions",   getUserPermissions);
router.patch("/users/:id/permissions", updateUserPermissions);

// ─── VIDEO PERMISSIONS (details first, then generic)
router.patch("/users/:id/permissions/video/details/toggle",                       toggleVideoDetailsSection);
router.patch("/users/:id/permissions/video/details/groups/:groupId",              toggleVideoDetailsGroup);
router.patch("/users/:id/permissions/video/details/groups/:groupId/opts/:optId",  toggleVideoDetailsOpt);
router.patch("/users/:id/permissions/video/:section/toggle",                      toggleVideoSection);
router.patch("/users/:id/permissions/video/:section/:itemId",                     toggleVideoItem);

// ─── VOICE PERMISSIONS
router.patch("/users/:id/permissions/voice/:section/toggle",                      toggleVoiceSection);
router.patch("/users/:id/permissions/voice/:section/:itemId",                     toggleVoiceItem);

// ─── CHARACTER PERMISSIONS (details first, then generic)
router.patch("/users/:id/permissions/character/details/toggle",                       toggleCharacterDetailsSection);
router.patch("/users/:id/permissions/character/details/groups/:groupId",              toggleCharacterDetailsGroup);
router.patch("/users/:id/permissions/character/details/groups/:groupId/opts/:optId",  toggleCharacterDetailsOpt);
router.patch("/users/:id/permissions/character/:section/toggle",                      toggleCharacterSection);
router.patch("/users/:id/permissions/character/:section/:itemId",                     toggleCharacterItem);

// ─── MUSIC PERMISSIONS (details first, then generic)
router.patch("/users/:id/permissions/music/details/toggle",                           toggleMusicDetailsSection);
router.patch("/users/:id/permissions/music/details/groups/:groupId",                  toggleMusicDetailsGroup);
router.patch("/users/:id/permissions/music/details/groups/:groupId/opts/:optId",      toggleMusicDetailsOpt);
router.patch("/users/:id/permissions/music/:section/toggle",                          toggleMusicSection);
router.patch("/users/:id/permissions/music/:section/:itemId",                         toggleMusicItem);

// ─── STORYBOARD PERMISSIONS (details first, then generic)
router.patch("/users/:id/permissions/storyboard/details/toggle",                          toggleStoryboardDetailsSection);
router.patch("/users/:id/permissions/storyboard/details/groups/:groupId",                 toggleStoryboardDetailsGroup);
router.patch("/users/:id/permissions/storyboard/details/groups/:groupId/opts/:optId",     toggleStoryboardDetailsOpt);
router.patch("/users/:id/permissions/storyboard/:section/toggle",                         toggleStoryboardSection);
router.patch("/users/:id/permissions/storyboard/:section/:itemId",                        toggleStoryboardItem);


// ─── IMAGE PERMISSIONS (details first, then generic)
router.patch("/users/:id/permissions/image/details/toggle",                       toggleImageDetailsSection);
router.patch("/users/:id/permissions/image/details/groups/:groupId",              toggleImageDetailsGroup);
router.patch("/users/:id/permissions/image/details/groups/:groupId/opts/:optId",  toggleImageDetailsOpt);
router.patch("/users/:id/permissions/image/:section/toggle",                      toggleImageSection);
router.patch("/users/:id/permissions/image/:section/:itemId",                     toggleImageItem);
// ─── IMAGE CATEGORY PERMISSIONS (separate from details)
router.patch("/users/:id/permissions/image/categories/toggle",                        toggleImageCategoriesSection);
router.patch("/users/:id/permissions/image/categories/groups/:groupId",               toggleImageCategoriesGroup);
router.patch("/users/:id/permissions/image/categories/groups/:groupId/items/:itemId", toggleImageCategoriesItem);
export default router;