import MusicBuilder from "../../models/MusicBuilder.js";
import User from "../../models/Usermodel/User.js";

const getMusicBuilder = async (res) => {
  const doc = await MusicBuilder.findOne();
  if (!doc) {
    res.status(404).json({ success: false, message: "MusicBuilder not found" });
    return null;
  }
  return doc;
};

const syncItemToUsers = async (sectionKey, itemId, isActive) => {
  if (isActive) {
    await User.updateMany(
      {},
      { $addToSet: { [`permissions.musicBuilder.${sectionKey}.allowedItems`]: itemId } }
    );
  } else {
    await User.updateMany(
      {},
      { $pull: { [`permissions.musicBuilder.${sectionKey}.allowedItems`]: itemId } }
    );
  }
};

// TYPES
export const getTypes = async (req, res) => {
  try {
    const doc = await getMusicBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.types });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchType = async (req, res) => {
  try {
    const doc = await getMusicBuilder(res); if (!doc) return;
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
    const doc = await getMusicBuilder(res); if (!doc) return;
    doc.types.isActive = !doc.types.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.musicBuilder.types.isActive": doc.types.isActive } }
    );
    res.status(200).json({ success: true, data: doc.types });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GENRES
export const getGenres = async (req, res) => {
  try {
    const doc = await getMusicBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.genres });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchGenre = async (req, res) => {
  try {
    const doc = await getMusicBuilder(res); if (!doc) return;
    const item = doc.genres.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    Object.assign(item, req.body);
    await doc.save();
    if (typeof req.body.isActive === "boolean") {
      await syncItemToUsers("genres", req.params.itemId, req.body.isActive);
    }
    res.status(200).json({ success: true, data: doc.genres });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleGenreSection = async (req, res) => {
  try {
    const doc = await getMusicBuilder(res); if (!doc) return;
    doc.genres.isActive = !doc.genres.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.musicBuilder.genres.isActive": doc.genres.isActive } }
    );
    res.status(200).json({ success: true, data: doc.genres });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DURATIONS
export const getDurations = async (req, res) => {
  try {
    const doc = await getMusicBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.durations });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchDuration = async (req, res) => {
  try {
    const doc = await getMusicBuilder(res); if (!doc) return;
    const item = doc.durations.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    Object.assign(item, req.body);
    await doc.save();
    if (typeof req.body.isActive === "boolean") {
      await syncItemToUsers("durations", req.params.itemId, req.body.isActive);
    }
    res.status(200).json({ success: true, data: doc.durations });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleDurationSection = async (req, res) => {
  try {
    const doc = await getMusicBuilder(res); if (!doc) return;
    doc.durations.isActive = !doc.durations.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.musicBuilder.durations.isActive": doc.durations.isActive } }
    );
    res.status(200).json({ success: true, data: doc.durations });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DETAILS
export const getDetails = async (req, res) => {
  try {
    const doc = await getMusicBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleDetailGroup = async (req, res) => {
  try {
    const doc = await getMusicBuilder(res); if (!doc) return;
    const group = doc.details.items.id(req.params.groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    group.isActive = !group.isActive;
    await doc.save();

    const { groupId } = req.params;
    const optIds = group.opts.map(o => String(o._id));

    if (group.isActive) {
      await User.updateMany({}, {
        $addToSet: { "permissions.musicBuilder.details.allowedGroups": groupId },
        $set:      { [`permissions.musicBuilder.details.allowedOpts.${groupId}`]: optIds },
      });
    } else {
      await User.updateMany({}, {
        $pull: { "permissions.musicBuilder.details.allowedGroups": groupId },
        $set:  { [`permissions.musicBuilder.details.allowedOpts.${groupId}`]: [] },
      });
    }

    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleDetailOpt = async (req, res) => {
  try {
    const doc = await getMusicBuilder(res); if (!doc) return;
    const group = doc.details.items.id(req.params.groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });
    const opt = group.opts.id(req.params.optId);
    if (!opt) return res.status(404).json({ success: false, message: "Opt not found" });

    opt.isActive = !opt.isActive;
    await doc.save();

    const { groupId, optId } = req.params;

    if (opt.isActive) {
      await User.updateMany({}, {
        $addToSet: { [`permissions.musicBuilder.details.allowedOpts.${groupId}`]: optId },
      });
    } else {
      await User.updateMany({}, {
        $pull: { [`permissions.musicBuilder.details.allowedOpts.${groupId}`]: optId },
      });
    }

    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleDetailSection = async (req, res) => {
  try {
    const doc = await getMusicBuilder(res); if (!doc) return;
    doc.details.isActive = !doc.details.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.musicBuilder.details.isActive": doc.details.isActive } }
    );
    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PRESETS
export const getPresets = async (req, res) => {
  try {
    const doc = await getMusicBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.presets });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const togglePresetSection = async (req, res) => {
  try {
    const doc = await getMusicBuilder(res); if (!doc) return;
    doc.presets.isActive = !doc.presets.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.musicBuilder.presets.isActive": doc.presets.isActive } }
    );
    res.status(200).json({ success: true, data: doc.presets });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};