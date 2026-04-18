import OpenAIAdapter from "./openai.adapter.js";
import GeminiAdapter from "./gemini.adapter.js";

const adapters = {
    openai: OpenAIAdapter,
    gemini: GeminiAdapter,
};

/**
 * Main function to execute an AI model.
 * 
 * @param {Object} modelDoc - The static model definition from the database (contains link, model_name).
 * @param {Object} nodeData - The dynamic node data from the canvas (contains model_attributes with values).
 * @returns {Promise<Object>} - The raw response from the AI provider.
 */
export const runAIModel = async (modelDoc, nodeData) => {
    try {
        if (!modelDoc || !nodeData) {
            throw new Error("Missing model description or node data for AI execution.");
        }

        // 1. Prepare inputs: extract values from nodeData.model_attributes
        // Note: The caller (canvas runner) should have resolved 'connectedFrom' values into 'value' field first.
        const inputs = {};
        const attributes = nodeData.model_attributes || [];

        attributes.forEach(attr => {
            if (attr.isActive && attr.value !== undefined && attr.value !== null && attr.value !== "") {
                inputs[attr.name] = attr.value;
            }
        });

        // 2. Identify the appropriate adapter
        let adapterKey = "openai"; // Default to OpenAI/Replicate
        const modelName = modelDoc.model_name ? modelDoc.model_name.toLowerCase() : "";
        const link = modelDoc.link ? modelDoc.link.toLowerCase() : "";

        if (modelName.includes("gemini") || link.includes("googleapis.com")) {
            adapterKey = "gemini";
        } else if (modelName.includes("gpt") || modelName.includes("openai") || link.includes("replicate.com")) {
            adapterKey = "openai";
        }

        const adapter = adapters[adapterKey];
        if (!adapter) {
            throw new Error(`No adapter found for model: ${modelDoc.model_name}. Tried: ${adapterKey}`);
        }

        console.log(`[AI Dispatcher] Running model: ${modelDoc.model_name} using ${adapterKey} adapter`);

        // 3. Delegate to specific adapter
        return await adapter.generate(modelDoc, inputs);

    } catch (error) {
        console.error(`[AI Dispatcher Error] ${modelDoc?.model_name || 'Unknown'}:`, error.message);
        throw error;
    }
};

export default {
    runAIModel,
    openai: OpenAIAdapter,
    gemini: GeminiAdapter
};
