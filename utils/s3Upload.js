// utils/s3Upload.js
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`, // ADD THIS
    credentials: {
        accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});


/**
 * Upload a single file buffer to S3
 * @param {Buffer} buffer
 * @param {string} originalName
 * @param {string} mimeType
 * @param {string} folder  - e.g. "images" | "videos"
 * @returns {Promise<string>} public S3 URL
 */
export const uploadToS3 = async (buffer, originalName, mimeType, folder = "uploads") => {
    const ext      = path.extname(originalName).toLowerCase();
    const fileName = `${folder}/${uuidv4()}${ext}`;

    const uploader = new Upload({
        client: s3,
        params: {
            Bucket:      process.env.S3_BUCKET_NAME,
            Key:         fileName,
            Body:        buffer,
            ContentType: mimeType,
        },
    });

    const result = await uploader.done();
    return result.Location; // public S3 URL
};