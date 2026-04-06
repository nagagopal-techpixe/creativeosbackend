import NavConfig from "../../models/NavConfig.js";

// ── GET /api/nav 
export const getNav = async (req, res) => {
  try {
    const nav = await NavConfig.findOne();

    if (!nav) {
      return res.status(404).json({ success: false, message: "Nav config not found" });
    }

    res.status(200).json({ success: true, data: nav });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update a single nav item by its id (e.g. 'images', 'videos')
export const updateNavItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // { label, icon, color, path, isActive }

    const nav = await NavConfig.findOne();

    if (!nav) {
      return res.status(404).json({ success: false, message: "Nav config not found" });
    }

    const item = nav.navItems.find((n) => n.id === id);

    if (!item) {
      return res.status(404).json({ success: false, message: `Nav item '${id}' not found` });
    }

    // Apply only the fields sent in body
    Object.assign(item, updates);

    await nav.save();

    res.status(200).json({ success: true, data: nav });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Toggle isActive for a single nav item
export const toggleNavItem = async (req, res) => {
  try {
    const { id } = req.params;

    const nav = await NavConfig.findOne();

    if (!nav) {
      return res.status(404).json({ success: false, message: "Nav config not found" });
    }

    const item = nav.navItems.find((n) => n.id === id);

    if (!item) {
      return res.status(404).json({ success: false, message: `Nav item '${id}' not found` });
    }

    item.isActive = !item.isActive;

    await nav.save();

    res.status(200).json({ success: true, data: nav });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};