import genrateimage from "../images/ai.js";

import MODELS from "../../models/models.js"
import { text } from "express";
import { uploadToS3 } from "../../utils/s3Upload.js";
import chars from '../../models/charactergenration.js'

async function saveToS3(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return url;

    const buffer = Buffer.from(await res.arrayBuffer());
    const ext =
      url.match(/\.(mp4|webm|mov|jpg|jpeg|png|webp|wav|mp3|ogg)/i)?.[1] ||
      "mp4";
    const mimeType = ext.match(/mp4|webm|mov/)
      ? `video/${ext}`
      : ext.match(/jpg|jpeg/)
        ? "image/jpeg"
        : ext.match(/png/)
          ? "image/png"
          : ext.match(/webp/)
            ? "image/webp"
            : ext.match(/wav/)
              ? "audio/wav"
              : ext.match(/mp3/)
                ? "audio/mpeg"
                : "audio/ogg";
    const folder = ext.match(/mp4|webm|mov/)
      ? "videos"
      : ext.match(/jpg|jpeg|png|webp/)
        ? "images"
        : "audio";

    //  Use your existing uploadToS3
    const s3Url = await uploadToS3(buffer, `output.${ext}`, mimeType, folder);
    console.log("Saved to S3:", s3Url);
    return s3Url;
  } catch (err) {
    console.error("S3 save failed:", err);
    return url; // fallback to original URL
  }
}

export const genrate_character_image = async(req,res)=>{
    try {
        const { prompt, modelid } = req.body;
        
        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({
                success: false,
                statuscode: 400,
                message: "A valid prompt string is required"
            });
        }
        const getmodel = await MODELS.findById(modelid);
        if (!getmodel) {
            return res.status(404).json({
                success: false,
                statuscode: 404,
                message: "model is not found"
            });
        }

        const inputs = getmodel.model_attributes || [];
        let content = [];
        for (let i = 0; i < inputs.length; i++) {
            const attr = inputs[i];
            if (!attr) continue;

            if (!attr.value || attr.value === "") {
                content.push({ type: attr.name, text: String(prompt) });
            } else {
                content.push({ type: attr.name, text: String(attr.value) });
            }
        }
        const messages = [
            {
                role: "user",
                content
            }
        ];

        // Call the AI generation service
        const imageUrl = await genrateimage.genrate(messages,getmodel);
        const s3url = await saveToS3(imageUrl)
        await chars.create({
            userid:  req.user._id,
            image: s3url
        })
        return res.status(200).json({
            success: true,
            statuscode: 200,
            message: "character generated successfully",
            raw: s3url // "raw = that image" as requested
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            statuscode: 500,
            message: "Internal Server Error",
            error: error.message
        })
    }
}