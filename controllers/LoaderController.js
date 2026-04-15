// controllers/imageLoaderController.js

import ImageLoader from "../models/Loader.js";
import { uploadToS3 } from "../utils/s3Upload.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.files?.image?.[0];

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    // 🔥 Upload to S3
    const url = await uploadToS3(
      file.buffer,
      file.originalname,
      file.mimetype,
      "images"
    );

    // 💾 Save in DB
    const image = await ImageLoader.create({
      url,
      userId: req.user?._id, // from auth middleware
    });

    return res.status(200).json({
      success: true,
      data: image,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};