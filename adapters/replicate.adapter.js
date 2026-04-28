/**
 * Adapter for Replicate models.
 */
const ReplicateAdapter = {
    /**
     * @param {Object} model - The model definition (from DB)
     * @param {Object} inputs - Key-value pairs from the node attributes or messages
     * @returns {Promise<Object>}
     */
    generate: async (model, inputs) => {
        const apiToken = process.env.REPLICATE_API_TOKEN;
        if (!apiToken) {
            throw new Error("Missing REPLICATE_API_TOKEN in .env file.");
        }

        // Step 1: Extract prompt + images from messages[].content
        if (!inputs.prompt && inputs.messages && Array.isArray(inputs.messages)) {
            let promptParts = [];
            let imageUrls = [];

            for (const msg of inputs.messages) {
                if (msg.content && Array.isArray(msg.content)) {
                    for (const item of msg.content) {
                        if (item.type === "text" && item.text) {
                            promptParts.push(item.text);
                        } else if (item.type === "image_url" && item.image_url?.url) {
                            imageUrls.push(item.image_url.url);
                        }
                    }
                } else if (typeof msg.content === "string") {
                    promptParts.push(msg.content);
                }
            }

            if (promptParts.length > 0) {
                inputs.prompt = promptParts.join("\n\n");
            }

            if (imageUrls.length > 0 && !inputs.image) {
                inputs.image = imageUrls[0];
            }
        }

        // Step 2: Fallback — scan all string fields (handles raw, text, query, anything)
        if (!inputs.prompt) {
            const SKIP_KEYS = new Set(["messages", "image", "image_url", "video", "audio", "negative_prompt"]);
            for (const [key, value] of Object.entries(inputs)) {
                if (!SKIP_KEYS.has(key) && typeof value === "string" && value.trim().length > 0) {
                    console.warn(`[ReplicateAdapter] No 'prompt' found. Using field "${key}" as prompt.`);
                    inputs.prompt = value.trim();
                    break;
                }
            }
        }

        // Step 3: Hard fail if still no prompt
        if (!inputs.prompt) {
            throw new Error("No prompt could be derived from inputs. Please provide a prompt attribute on the node.");
        }

        // Step 4: Use model.prompt_field if defined (e.g. "text" for flux-schnell), else default to "prompt"
        const promptField = model.prompt_field || "prompt";

        // Step 5: Strip internal/meta fields and build clean Replicate input
        const { messages, raw, prompt, ...rest } = inputs;

        const replicateInputs = {
            [promptField]: prompt,  // e.g. { prompt: "..." } or { text: "..." }
            ...rest
        };

        const url = model.link;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Token ${apiToken}`
        };

        const body = { input: replicateInputs };

        try {
            console.log("Replicate Request Body (sent to API):", JSON.stringify(body, null, 2));

            const response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(`Replicate API Error: ${response.status} - ${JSON.stringify(error)}`);
            }

            let result = await response.json();

            // Step 6: Poll if async prediction
            if (result.urls && result.urls.get) {
                const pollUrl = result.urls.get;
                while (!["succeeded", "failed", "canceled"].includes(result.status)) {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    const pollRes = await fetch(pollUrl, { headers });
                    result = await pollRes.json();
                }

                if (result.status === "failed") {
                    throw new Error(`Replicate prediction failed: ${result.error || "Unknown error"}`);
                }
            }

            // Step 7: Return output
            const output = result?.data?.output ?? result?.output;
            return Array.isArray(output) ? output.join("") : output;

        } catch (error) {
            console.error("Replicate Adapter Generate Error:", error);
            throw error;
        }
    }
};

export default ReplicateAdapter;