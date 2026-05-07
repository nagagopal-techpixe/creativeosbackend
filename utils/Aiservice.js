// services/aiService.js
import axios from "axios";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

/**
 * Send a generation to o4-mini via Replicate
 * @param {import('../models/Generation').default} generation  Mongoose doc
 * @returns {Promise<object>}  { output, rawResponse, durationMs }
 */
export const sendToAI = async (generation) => {
  const start = Date.now();

  // Build messages array from attached files (images supported by o4-mini)
  const imageUrls = generation.attachedFiles
    .filter((f) => f.fileType === "image")
    .map((f) => f.s3Url);

  const response = await axios.post(
    "https://api.replicate.com/v1/models/openai/o4-mini/predictions",
    {
      input: {
        prompt:               generation.prompt,
        messages:             [],
        image_input:          imageUrls,       // pass any attached images
        system_prompt:        buildSystemPrompt(generation.category),
        reasoning_effort:     "high",
        max_completion_tokens: 4096,
      },
    },
    {
      headers: {
        Authorization:  `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        Prefer:         "wait",               // wait for result inline (no polling)
      },
    }
  );

  const data = response.data;

  // Replicate wraps output in data.output — can be string or array
  const outputText = Array.isArray(data.output)
    ? data.output.join("")
    : data.output ?? "";

  return {
    provider:    "replicate",
    modelId:     "openai/o4-mini",
    rawResponse: data,
    outputUrls:  [],        
    outputText,                
    durationMs:  Date.now() - start,
  };
};

// ─── System prompt per category
const buildSystemPrompt = (category) => {
  const prompts = {
    "UGC Ads":
      "You are an expert UGC ad scriptwriter. Generate compelling, authentic, short-form video scripts and creative briefs.",
    "TVC Ads":
      " You are a senior TVC creative director. Generate cinematic, story-driven television commercial scripts with scene directions.",
    "Branding":
      "You are a brand strategist. Generate brand identity copy, messaging frameworks, and visual direction briefs.",
    "E-commerce":
      "You are an e-commerce conversion specialist. Generate product descriptions, ad copy, and visual shot lists.",
    "Character Shorts":
      "You are an animation director. Generate character dialogue, scene breakdowns, and storyboard descriptions.",
  };

  return prompts[category] || "You are a creative AI assistant. Help generate compelling visual content ideas and scripts.";
};