import mongoose from "mongoose";

const navItemSchema = new mongoose.Schema({
  id:       String,
  label:    String,
  icon:     String,
  color:    String,
  path:     String,
  isActive: { type: Boolean, default: true }
}, { _id: true });

const navConfigSchema = new mongoose.Schema({
  navItems: {
    isActive: { type: Boolean, default: true },
    items:    [navItemSchema],
  }
});

export default mongoose.models.NavConfig ||
  mongoose.model("NavConfig", navConfigSchema);