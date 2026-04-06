import VideoBuilder from "../../models/VideoBuilder.js";
import User from "../../models/UserModel/User.js";

const getVideoBuilder = async (res) => {
  const doc = await VideoBuilder.findOne();
  if (!doc) { res.status(404).json({ success: false, message: "VideoBuilder not found" }); return null; }
  return doc;
};

// ── HELPER — sync item toggle to all users
const syncItemToUsers = async (builderKey, sectionKey, itemId, isActive) => {
  if (isActive) {
    await User.updateMany(
      {},
      { $addToSet: { [`permissions.${builderKey}.${sectionKey}.allowedItems`]: itemId } }
    );
  } else {
    await User.updateMany(
      {},
      { $pull: { [`permissions.${builderKey}.${sectionKey}.allowedItems`]: itemId } }
    );
  }
};

// TYPES
export const getTypes = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.types });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchType = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    const item = doc.types.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    Object.assign(item, req.body);
    await doc.save();
    if (typeof req.body.isActive === "boolean") {
      await syncItemToUsers("videoBuilder", "types", req.params.itemId, req.body.isActive);
    }
    res.status(200).json({ success: true, data: doc.types });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleTypeSection = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    doc.types.isActive = !doc.types.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.videoBuilder.types.isActive": doc.types.isActive } }
    );
    res.status(200).json({ success: true, data: doc.types });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// STYLES
export const getStyles = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.styles });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchStyle = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    const item = doc.styles.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    Object.assign(item, req.body);
    await doc.save();
    if (typeof req.body.isActive === "boolean") {
      await syncItemToUsers("videoBuilder", "styles", req.params.itemId, req.body.isActive);
    }
    res.status(200).json({ success: true, data: doc.styles });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleStyleSection = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    doc.styles.isActive = !doc.styles.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.videoBuilder.styles.isActive": doc.styles.isActive } }
    );
    res.status(200).json({ success: true, data: doc.styles });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DURATIONS
export const getDurations = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.durations });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchDuration = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    const item = doc.durations.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    Object.assign(item, req.body);
    await doc.save();
    if (typeof req.body.isActive === "boolean") {
      await syncItemToUsers("videoBuilder", "durations", req.params.itemId, req.body.isActive);
    }
    res.status(200).json({ success: true, data: doc.durations });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleDurationSection = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    doc.durations.isActive = !doc.durations.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.videoBuilder.durations.isActive": doc.durations.isActive } }
    );
    res.status(200).json({ success: true, data: doc.durations });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// FORMATS
export const getFormats = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.formats });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchFormat = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    const item = doc.formats.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    Object.assign(item, req.body);
    await doc.save();
    if (typeof req.body.isActive === "boolean") {
      await syncItemToUsers("videoBuilder", "formats", req.params.itemId, req.body.isActive);
    }
    res.status(200).json({ success: true, data: doc.formats });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleFormatSection = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    doc.formats.isActive = !doc.formats.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.videoBuilder.formats.isActive": doc.formats.isActive } }
    );
    res.status(200).json({ success: true, data: doc.formats });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// HOOKS
export const getHooks = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.hooks });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchHook = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    const item = doc.hooks.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    Object.assign(item, req.body);
    await doc.save();
    if (typeof req.body.isActive === "boolean") {
      await syncItemToUsers("videoBuilder", "hooks", req.params.itemId, req.body.isActive);
    }
    res.status(200).json({ success: true, data: doc.hooks });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleHookSection = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    doc.hooks.isActive = !doc.hooks.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.videoBuilder.hooks.isActive": doc.hooks.isActive } }
    );
    res.status(200).json({ success: true, data: doc.hooks });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DETAILS
export const getDetails = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleDetailGroup = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    const group = doc.details.items.id(req.params.groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });
    group.isActive = !group.isActive;
    await doc.save();

    const { groupId } = req.params;

    if (group.isActive) {
      // group turned ON → add group + all its opts back to all users
      await User.updateMany(
        {},
        { $addToSet: { "permissions.videoBuilder.details.allowedGroups": groupId } }
      );
      const optIds = group.opts.map(o => String(o._id));
      const users = await User.find({});
      await Promise.all(users.map(async (user) => {
        const allowedOpts = user.permissions?.videoBuilder?.details?.allowedOpts ?? {};
        allowedOpts[groupId] = optIds;
        user.permissions.videoBuilder.details.allowedOpts = allowedOpts;
        user.markModified("permissions.videoBuilder.details.allowedOpts");
        await user.save();
      }));
    } else {
      // group turned OFF → remove group + clear its opts from all users
      await User.updateMany(
        {},
        { $pull: { "permissions.videoBuilder.details.allowedGroups": groupId } }
      );
      const users = await User.find({});
      await Promise.all(users.map(async (user) => {
        const allowedOpts = user.permissions?.videoBuilder?.details?.allowedOpts ?? {};
        allowedOpts[groupId] = [];
        user.permissions.videoBuilder.details.allowedOpts = allowedOpts;
        user.markModified("permissions.videoBuilder.details.allowedOpts");
        await user.save();
      }));
    }

    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleDetailOpt = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    const group = doc.details.items.id(req.params.groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });
    const opt = group.opts.id(req.params.optId);
    if (!opt) return res.status(404).json({ success: false, message: "Opt not found" });
    opt.isActive = !opt.isActive;
    await doc.save();

    const { groupId, optId } = req.params;

    // ── sync to all users (Mixed field needs manual update)
    const users = await User.find({});
    await Promise.all(users.map(async (user) => {
      const allowedOpts = user.permissions?.videoBuilder?.details?.allowedOpts ?? {};
      const current = (allowedOpts[groupId] ?? []).map(String);

      allowedOpts[groupId] = opt.isActive
        ? [...new Set([...current, optId])]
        : current.filter(id => id !== optId);

      user.permissions.videoBuilder.details.allowedOpts = allowedOpts;
      user.markModified("permissions.videoBuilder.details.allowedOpts");
      await user.save();
    }));

    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleDetailSection = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    doc.details.isActive = !doc.details.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.videoBuilder.details.isActive": doc.details.isActive } }
    );
    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PRESETS
export const getPresets = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.presets });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const togglePresetSection = async (req, res) => {
  try {
    const doc = await getVideoBuilder(res); if (!doc) return;
    doc.presets.isActive = !doc.presets.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.videoBuilder.presets.isActive": doc.presets.isActive } }
    );
    res.status(200).json({ success: true, data: doc.presets });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};