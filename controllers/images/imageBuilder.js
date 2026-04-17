import ImageBuilder from "../../models/ImageBuilder.js";
import User from "../../models/Usermodel/User.js";

const getImageBuilder = async (res) => {
  const doc = await ImageBuilder.findOne();
  if (!doc) {
    res.status(404).json({ success: false, message: "ImageBuilder not found" });
    return null;
  }
  return doc;
};

const syncItemToUsers = async (sectionKey, itemId, isActive) => {
  if (isActive) {
    await User.updateMany(
      {},
      { $addToSet: { [`permissions.imageBuilder.${sectionKey}.allowedItems`]: itemId } }
    );
  } else {
    await User.updateMany(
      {},
      { $pull: { [`permissions.imageBuilder.${sectionKey}.allowedItems`]: itemId } }
    );
  }
};

// TABS
export const getTabs = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.tabs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchTab = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    const item = doc.tabs.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Tab not found" });
    Object.assign(item, req.body);
    await doc.save();
    if (typeof req.body.isActive === "boolean") {
      await syncItemToUsers("tabs", req.params.itemId, req.body.isActive);
    }
    res.status(200).json({ success: true, data: doc.tabs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleTabSection = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    doc.tabs.isActive = !doc.tabs.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.imageBuilder.tabs.isActive": doc.tabs.isActive } }
    );
    res.status(200).json({ success: true, data: doc.tabs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.categories });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleCategoryGroup = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    const group = doc.categories.items.id(req.params.groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    group.isActive = !group.isActive;
    await doc.save();

    const { groupId } = req.params;
    const itemIds = group.items.map(i => String(i._id));

    if (group.isActive) {
      await User.updateMany({}, {
        $addToSet: { "permissions.imageBuilder.categories.allowedGroups": groupId },
        $set:      { [`permissions.imageBuilder.categories.allowedOpts.${groupId}`]: itemIds },
      });
    } else {
      await User.updateMany({}, {
        $pull: { "permissions.imageBuilder.categories.allowedGroups": groupId },
        $set:  { [`permissions.imageBuilder.categories.allowedOpts.${groupId}`]: [] },
      });
    }

    res.status(200).json({ success: true, data: doc.categories });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleCategoryItem = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    const group = doc.categories.items.id(req.params.groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });
    const item = group.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    item.isActive = !item.isActive;
    await doc.save();

    const { groupId, itemId } = req.params;

    if (item.isActive) {
      await User.updateMany({}, {
        $addToSet: { [`permissions.imageBuilder.categories.allowedOpts.${groupId}`]: itemId },
      });
    } else {
      await User.updateMany({}, {
        $pull: { [`permissions.imageBuilder.categories.allowedOpts.${groupId}`]: itemId },
      });
    }

    res.status(200).json({ success: true, data: doc.categories });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleCategorySection = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    doc.categories.isActive = !doc.categories.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.imageBuilder.categories.isActive": doc.categories.isActive } }
    );
    res.status(200).json({ success: true, data: doc.categories });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// RECENT GENERATIONS
export const getRecentGenerations = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.recentGenerations });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchRecentGeneration = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    const item = doc.recentGenerations.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    Object.assign(item, req.body);
    await doc.save();
    if (typeof req.body.isActive === "boolean") {
      await syncItemToUsers("recentGenerations", req.params.itemId, req.body.isActive);
    }
    res.status(200).json({ success: true, data: doc.recentGenerations });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleRecentSection = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    doc.recentGenerations.isActive = !doc.recentGenerations.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.imageBuilder.recentGenerations.isActive": doc.recentGenerations.isActive } }
    );
    res.status(200).json({ success: true, data: doc.recentGenerations });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// TYPES
export const getTypes = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.types });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchType = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    const item = doc.types.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    Object.assign(item, req.body);
    await doc.save();
    if (typeof req.body.isActive === "boolean") {
      await syncItemToUsers("types", req.params.itemId, req.body.isActive);
    }
    res.status(200).json({ success: true, data: doc.types });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleTypeSection = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    doc.types.isActive = !doc.types.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.imageBuilder.types.isActive": doc.types.isActive } }
    );
    res.status(200).json({ success: true, data: doc.types });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// STYLES
export const getStyles = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.styles });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchStyle = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    const item = doc.styles.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    Object.assign(item, req.body);
    await doc.save();
    if (typeof req.body.isActive === "boolean") {
      await syncItemToUsers("styles", req.params.itemId, req.body.isActive);
    }
    res.status(200).json({ success: true, data: doc.styles });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleStyleSection = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    doc.styles.isActive = !doc.styles.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.imageBuilder.styles.isActive": doc.styles.isActive } }
    );
    res.status(200).json({ success: true, data: doc.styles });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// RATIOS
export const getRatios = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.ratios });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchRatio = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    const item = doc.ratios.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    Object.assign(item, req.body);
    await doc.save();
    if (typeof req.body.isActive === "boolean") {
      await syncItemToUsers("ratios", req.params.itemId, req.body.isActive);
    }
    res.status(200).json({ success: true, data: doc.ratios });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleRatioSection = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    doc.ratios.isActive = !doc.ratios.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.imageBuilder.ratios.isActive": doc.ratios.isActive } }
    );
    res.status(200).json({ success: true, data: doc.ratios });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DETAILS
export const getDetails = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleDetailGroup = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    const group = doc.details.items.id(req.params.groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    group.isActive = !group.isActive;
    await doc.save();

    const { groupId } = req.params;
    const optIds = group.opts.map(o => String(o._id));

    if (group.isActive) {
      await User.updateMany({}, {
        $addToSet: { "permissions.imageBuilder.details.allowedGroups": groupId },
        $set:      { [`permissions.imageBuilder.details.allowedOpts.${groupId}`]: optIds },
      });
    } else {
      await User.updateMany({}, {
        $pull: { "permissions.imageBuilder.details.allowedGroups": groupId },
        $set:  { [`permissions.imageBuilder.details.allowedOpts.${groupId}`]: [] },
      });
    }

    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleDetailOpt = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    const group = doc.details.items.id(req.params.groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });
    const opt = group.opts.id(req.params.optId);
    if (!opt) return res.status(404).json({ success: false, message: "Opt not found" });

    opt.isActive = !opt.isActive;
    await doc.save();

    const { groupId, optId } = req.params;

    if (opt.isActive) {
      await User.updateMany({}, {
        $addToSet: { [`permissions.imageBuilder.details.allowedOpts.${groupId}`]: optId },
      });
    } else {
      await User.updateMany({}, {
        $pull: { [`permissions.imageBuilder.details.allowedOpts.${groupId}`]: optId },
      });
    }

    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleDetailSection = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    doc.details.isActive = !doc.details.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.imageBuilder.details.isActive": doc.details.isActive } }
    );
    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PRESETS
export const getPresets = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.presets });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const togglePresetSection = async (req, res) => {
  try {
    const doc = await getImageBuilder(res); if (!doc) return;
    doc.presets.isActive = !doc.presets.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.imageBuilder.presets.isActive": doc.presets.isActive } }
    );
    res.status(200).json({ success: true, data: doc.presets });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};