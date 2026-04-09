import CharacterBuilder from "../../models/CharacterBuilder.js";
import User from "../../models/UserModel/User.js";

const getCharacterBuilder = async (res) => {
  const doc = await CharacterBuilder.findOne();
  if (!doc) {
    res.status(404).json({ success: false, message: "CharacterBuilder not found" });
    return null;
  }
  return doc;
};

const syncItemToUsers = async (sectionKey, itemId, isActive) => {
  if (isActive) {
    await User.updateMany(
      {},
      { $addToSet: { [`permissions.characterBuilder.${sectionKey}.allowedItems`]: itemId } }
    );
  } else {
    await User.updateMany(
      {},
      { $pull: { [`permissions.characterBuilder.${sectionKey}.allowedItems`]: itemId } }
    );
  }
};

// TYPES
export const getTypes = async (req, res) => {
  try {
    const doc = await getCharacterBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.types });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchType = async (req, res) => {
  try {
    const doc = await getCharacterBuilder(res); if (!doc) return;
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
    const doc = await getCharacterBuilder(res); if (!doc) return;
    doc.types.isActive = !doc.types.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.characterBuilder.types.isActive": doc.types.isActive } }
    );
    res.status(200).json({ success: true, data: doc.types });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// STYLES
export const getStyles = async (req, res) => {
  try {
    const doc = await getCharacterBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.styles });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchStyle = async (req, res) => {
  try {
    const doc = await getCharacterBuilder(res); if (!doc) return;
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
    const doc = await getCharacterBuilder(res); if (!doc) return;
    doc.styles.isActive = !doc.styles.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.characterBuilder.styles.isActive": doc.styles.isActive } }
    );
    res.status(200).json({ success: true, data: doc.styles });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POSES
export const getPoses = async (req, res) => {
  try {
    const doc = await getCharacterBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.poses });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const patchPose = async (req, res) => {
  try {
    const doc = await getCharacterBuilder(res); if (!doc) return;
    const item = doc.poses.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    Object.assign(item, req.body);
    await doc.save();
    if (typeof req.body.isActive === "boolean") {
      await syncItemToUsers("poses", req.params.itemId, req.body.isActive);
    }
    res.status(200).json({ success: true, data: doc.poses });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const togglePoseSection = async (req, res) => {
  try {
    const doc = await getCharacterBuilder(res); if (!doc) return;
    doc.poses.isActive = !doc.poses.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.characterBuilder.poses.isActive": doc.poses.isActive } }
    );
    res.status(200).json({ success: true, data: doc.poses });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DETAILS
export const getDetails = async (req, res) => {
  try {
    const doc = await getCharacterBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleDetailGroup = async (req, res) => {
  try {
    const doc = await getCharacterBuilder(res); if (!doc) return;
    const group = doc.details.items.id(req.params.groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    group.isActive = !group.isActive;
    await doc.save();

    const { groupId } = req.params;
    const optIds = group.opts.map(o => String(o._id));

    if (group.isActive) {
      await User.updateMany({}, {
        $addToSet: { "permissions.characterBuilder.details.allowedGroups": groupId },
        $set:      { [`permissions.characterBuilder.details.allowedOpts.${groupId}`]: optIds },
      });
    } else {
      await User.updateMany({}, {
        $pull: { "permissions.characterBuilder.details.allowedGroups": groupId },
        $set:  { [`permissions.characterBuilder.details.allowedOpts.${groupId}`]: [] },
      });
    }

    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleDetailOpt = async (req, res) => {
  try {
    const doc = await getCharacterBuilder(res); if (!doc) return;
    const group = doc.details.items.id(req.params.groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });
    const opt = group.opts.id(req.params.optId);
    if (!opt) return res.status(404).json({ success: false, message: "Opt not found" });

    opt.isActive = !opt.isActive;
    await doc.save();

    const { groupId, optId } = req.params;

    if (opt.isActive) {
      await User.updateMany({}, {
        $addToSet: { [`permissions.characterBuilder.details.allowedOpts.${groupId}`]: optId },
      });
    } else {
      await User.updateMany({}, {
        $pull: { [`permissions.characterBuilder.details.allowedOpts.${groupId}`]: optId },
      });
    }

    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const toggleDetailSection = async (req, res) => {
  try {
    const doc = await getCharacterBuilder(res); if (!doc) return;
    doc.details.isActive = !doc.details.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.characterBuilder.details.isActive": doc.details.isActive } }
    );
    res.status(200).json({ success: true, data: doc.details });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PRESETS
export const getPresets = async (req, res) => {
  try {
    const doc = await getCharacterBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.presets });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const togglePresetSection = async (req, res) => {
  try {
    const doc = await getCharacterBuilder(res); if (!doc) return;
    doc.presets.isActive = !doc.presets.isActive;
    await doc.save();
    await User.updateMany(
      {},
      { $set: { "permissions.characterBuilder.presets.isActive": doc.presets.isActive } }
    );
    res.status(200).json({ success: true, data: doc.presets });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};