import VoiceBuilder from "../../models/VoiceBuilder.js";

// HELPER
const getVoiceBuilder = async (res) => {
  const doc = await VoiceBuilder.findOne();
  if (!doc) {
    res.status(404).json({ success: false, message: "VoiceBuilder not found" });
    return null;
  }
  return doc;
};

//
// TYPES
//

export const getTypes = async (req, res) => {
  try {
    const doc = await getVoiceBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.types });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const patchType = async (req, res) => {
  try {
    const doc = await getVoiceBuilder(res); if (!doc) return;

    const item = doc.types.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    Object.assign(item, req.body);
    await doc.save();

    res.status(200).json({ success: true, data: doc.types });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleTypeSection = async (req, res) => {
  try {
    const doc = await getVoiceBuilder(res); if (!doc) return;

    doc.types.isActive = !doc.types.isActive;
    await doc.save();

    res.status(200).json({ success: true, data: doc.types });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//
// TONES
//

export const getTones = async (req, res) => {
  try {
    const doc = await getVoiceBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.tones });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const patchTone = async (req, res) => {
  try {
    const doc = await getVoiceBuilder(res); if (!doc) return;

    const item = doc.tones.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    Object.assign(item, req.body);
    await doc.save();

    res.status(200).json({ success: true, data: doc.tones });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleToneSection = async (req, res) => {
  try {
    const doc = await getVoiceBuilder(res); if (!doc) return;

    doc.tones.isActive = !doc.tones.isActive;
    await doc.save();

    res.status(200).json({ success: true, data: doc.tones });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//
// PACING
//

export const getPacing = async (req, res) => {
  try {
    const doc = await getVoiceBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.pacing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const patchPacing = async (req, res) => {
  try {
    const doc = await getVoiceBuilder(res); if (!doc) return;

    const item = doc.pacing.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    Object.assign(item, req.body);
    await doc.save();

    res.status(200).json({ success: true, data: doc.pacing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const togglePacingSection = async (req, res) => {
  try {
    const doc = await getVoiceBuilder(res); if (!doc) return;

    doc.pacing.isActive = !doc.pacing.isActive;
    await doc.save();

    res.status(200).json({ success: true, data: doc.pacing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//
// PRESETS
//

export const getPresets = async (req, res) => {
  try {
    const doc = await getVoiceBuilder(res); if (!doc) return;
    res.status(200).json({ success: true, data: doc.presets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const togglePresetSection = async (req, res) => {
  try {
    const doc = await getVoiceBuilder(res); if (!doc) return;

    doc.presets.isActive = !doc.presets.isActive;
    await doc.save();

    res.status(200).json({ success: true, data: doc.presets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};