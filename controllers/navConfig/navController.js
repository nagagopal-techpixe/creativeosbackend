import NavConfig from "../../models/NavConfig.js";
import User     from "../../models/UserModel/User.js";

// ── HELPER — get doc
const getNavConfig = async (res) => {
  const doc = await NavConfig.findOne();
  if (!doc) {
    res.status(404).json({ success: false, message: "NavConfig not found" });
    return null;
  }
  return doc;
};

// ── HELPER — sync single item to all users
const syncNavItemToUsers = async (itemId, isActive) => {
  if (isActive) {
    await User.updateMany(
      {},
      { $addToSet: { "permissions.navItems.allowedItems": itemId } }
    );
  } else {
    await User.updateMany(
      {},
      { $pull: { "permissions.navItems.allowedItems": itemId } }
    );
  }
};

// ── GET /admin/nav
export const getNav = async (req, res) => {
  try {
    const doc = await getNavConfig(res); if (!doc) return;
    res.json({ success: true, data: doc.navItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PATCH /admin/nav/item/:itemId  (edit label/icon/color/path)
export const updateNavItem = async (req, res) => {
  try {
    const doc = await getNavConfig(res); if (!doc) return;

    const item = doc.navItems.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    const { label, icon, color, path } = req.body;
    if (label !== undefined) item.label = label;
    if (icon  !== undefined) item.icon  = icon;
    if (color !== undefined) item.color = color;
    if (path  !== undefined) item.path  = path;

    await doc.save();
    res.json({ success: true, data: doc.navItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PATCH /admin/nav/item/:itemId/toggle  (toggle single item + sync users)
export const toggleNavItem = async (req, res) => {
  try {
    const doc = await getNavConfig(res); if (!doc) return;

    //  exact same as video: find by _id using .id()
    const item = doc.navItems.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    item.isActive = typeof req.body.isActive === "boolean"
      ? req.body.isActive
      : !item.isActive;

    await doc.save();

    //  sync to all users using the stable _id
    await syncNavItemToUsers(req.params.itemId, item.isActive);

    res.json({ success: true, data: doc.navItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PATCH /admin/nav/section/toggle  (toggle entire section + sync users)
export const toggleNavSection = async (req, res) => {
  try {
    const doc = await getNavConfig(res); if (!doc) return;

    doc.navItems.isActive = typeof req.body.isActive === "boolean"
      ? req.body.isActive
      : !doc.navItems.isActive;

    // flip all items to match section
    doc.navItems.items.forEach(item => item.isActive = doc.navItems.isActive);
    await doc.save();

    //  sync to all users
    await User.updateMany(
      {},
      { $set: { "permissions.navItems.isActive": doc.navItems.isActive } }
    );

    if (doc.navItems.isActive) {
      // add all item _ids to every user
      const allItemIds = doc.navItems.items.map(i => i._id);
      await User.updateMany(
        {},
        { $set: { "permissions.navItems.allowedItems": allItemIds } }
      );
    } else {
      await User.updateMany(
        {},
        { $set: { "permissions.navItems.allowedItems": [] } }
      );
    }

    res.json({ success: true, data: doc.navItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};