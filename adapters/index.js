import OpenAIAdapter from "./openai.adapter.js";
import GeminiAdapter from "./gemini.adapter.js";
import ReplicateAdapter from "./replicate.adapter.js";

/**
 * Main dispatcher to route requests to the appropriate AI adapter.
 * 
 * @param {Object} model - The model definition (must have .provider field)
 * @param {Object|Array} inputs - The parameters or messages to send to the AI
 * @returns {Promise<Object>}
 */
export const runModelAdapter = async (model, inputs) => {
    if (!model || !model.provider) {
        throw new Error("Invalid model configuration: missing provider.");
    }

    switch (model.provider) {
        case "chatGpt":
            return await OpenAIAdapter.generate(model, inputs);
        case "Gemini":
            return await GeminiAdapter.generate(model, inputs);
        case "replicate":
            return await ReplicateAdapter.generate(model, inputs);
        default:
            throw new Error(`No Adapter Found for provider: ${model.provider}`);
    }
};

export default {
    runModelAdapter,
    OpenAIAdapter,
    GeminiAdapter,
    ReplicateAdapter
};
