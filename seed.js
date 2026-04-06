import mongoose from "mongoose";
import dotenv from "dotenv";
import NavConfig from "./models/NavConfig.js";

dotenv.config();

const seed = async () => {
  try {
    // ✅ 1. CONNECT FIRST
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // ✅ 2. RUN QUERY AFTER CONNECTION
    await NavConfig.findByIdAndUpdate(
      "69d09f6e452bba28f3841758",
      {
        $push: {
          navItems: {
            id: "storyboard",
            label: "Storyboard",
            icon: "Clapperboard",
            color: "purple",
            path: "/storyboard",
            isActive: true
          }
        }
      },
      { new: true }
    );

    console.log("✅ Storyboard added to nav");

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seed();