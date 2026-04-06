import StoryboardBuilder from "../../models/StoryboardBuilder.js";

//
// HELPER
//
const getBuilder = async (res) => {
  const doc = await StoryboardBuilder.findOne();
  if (!doc) {
    res.status(404).json({ success: false, message: "StoryboardBuilder not found" });
    return null;
  }
  return doc;
};

//
// TYPES
//
export const getTypes = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  res.json({ success: true, data: doc.types });
};

export const patchType = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  const item = doc.types.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ success: false });

  Object.assign(item, req.body);
  await doc.save();

  res.json({ success: true, data: doc.types });
};

export const toggleTypeSection = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  doc.types.isActive = !doc.types.isActive;
  await doc.save();
  res.json({ success: true, data: doc.types });
};

//
// STYLES
//
export const getStyles = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  res.json({ success: true, data: doc.styles });
};

export const patchStyle = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  const item = doc.styles.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ success: false });

  Object.assign(item, req.body);
  await doc.save();

  res.json({ success: true, data: doc.styles });
};

export const toggleStyleSection = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  doc.styles.isActive = !doc.styles.isActive;
  await doc.save();
  res.json({ success: true, data: doc.styles });
};

//
// FRAMES
//
export const getFrames = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  res.json({ success: true, data: doc.frames });
};

export const patchFrame = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  const item = doc.frames.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ success: false });

  Object.assign(item, req.body);
  await doc.save();

  res.json({ success: true, data: doc.frames });
};

export const toggleFrameSection = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  doc.frames.isActive = !doc.frames.isActive;
  await doc.save();
  res.json({ success: true, data: doc.frames });
};

//
// RATIOS
//
export const getRatios = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  res.json({ success: true, data: doc.ratios });
};

export const patchRatio = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  const item = doc.ratios.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ success: false });

  Object.assign(item, req.body);
  await doc.save();

  res.json({ success: true, data: doc.ratios });
};

export const toggleRatioSection = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  doc.ratios.isActive = !doc.ratios.isActive;
  await doc.save();
  res.json({ success: true, data: doc.ratios });
};

//
// DETAILS (GROUP + OPTS)
//
export const getDetails = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  res.json({ success: true, data: doc.details });
};

export const toggleDetailGroup = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  const group = doc.details.items.id(req.params.groupId);
  if (!group) return res.status(404).json({ success: false });

  group.isActive = !group.isActive;
  await doc.save();

  res.json({ success: true, data: doc.details });
};

export const toggleDetailOpt = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  const group = doc.details.items.id(req.params.groupId);
  const opt = group?.opts.id(req.params.optId);

  if (!opt) return res.status(404).json({ success: false });

  opt.isActive = !opt.isActive;
  await doc.save();

  res.json({ success: true, data: doc.details });
};

export const toggleDetailSection = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  doc.details.isActive = !doc.details.isActive;
  await doc.save();
  res.json({ success: true, data: doc.details });
};

//
// PRESETS
//
export const getPresets = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  res.json({ success: true, data: doc.presets });
};

export const togglePresetSection = async (req, res) => {
  const doc = await getBuilder(res); if (!doc) return;
  doc.presets.isActive = !doc.presets.isActive;
  await doc.save();
  res.json({ success: true, data: doc.presets });
};