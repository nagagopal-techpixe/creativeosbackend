// scripts/reseedNav.js
import mongoose from "mongoose";
import NavConfig from "./models/NavConfig.js";
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

// delete old document
await NavConfig.deleteMany({});

// insert fresh with new structure
await NavConfig.create({
  navItems: {
    isActive: true,
    items: [
      { id: "images",     label: "Images",     icon: "ImageIcon",   color: "emerald", path: "/images",     isActive: true },
      { id: "videos",     label: "Videos",     icon: "Video",       color: "blue",    path: "/videos",     isActive: true },
      { id: "voice",      label: "Voice",      icon: "Mic",         color: "amber",   path: "/voice",      isActive: true },
      { id: "music",      label: "Music",      icon: "Music",       color: "rose",    path: "/music",      isActive: true },
      { id: "characters", label: "Characters", icon: "User",        color: "indigo",  path: "/characters", isActive: true },
      { id: "storyboard", label: "Storyboard", icon: "Clapperboard",color: "purple",  path: "/storyboard", isActive: true },
    ]
  }
});

console.log(" NavConfig reseeded with new structure");
await mongoose.disconnect();