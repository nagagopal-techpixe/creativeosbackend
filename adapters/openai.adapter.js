/**
 * Adapter for OpenAI models.
 * Handles both direct OpenAI API and Replicate-hosted models.
 */
const OpenAIAdapter = {
    /**
     * @param {Object} model - The model definition (from DB)
     * @param {Object} inputs - Key-value pairs from the node attributes
     * @returns {Promise<Object>}
     */
    generate: async (model, inputs) => {
        const url = model.link;
        const isReplicate = url.includes("replicate.com");
        
        const apiToken = isReplicate 
            ? process.env.REPLICATE_API_TOKEN 
            : process.env.OPENAI_API_KEY;

        if (!apiToken) {
            throw new Error(`Missing API token for ${isReplicate ? 'Replicate' : 'OpenAI'}. Please set it in your .env file.`);
        }

        const headers = {
            "Content-Type": "application/json",
            "Authorization": isReplicate ? `Token ${apiToken}` : `Bearer ${apiToken}`
        };

        const body = isReplicate 
            ? { input: inputs } 
            : {
                model: model.model_name,
                ...inputs
            };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(`OpenAI/Replicate API Error: ${response.status} - ${JSON.stringify(error)}`);
            }

            let result = await response.json();

            // Basic polling for Replicate predictions
            if (isReplicate && result.urls && result.urls.get) {
                const pollUrl = result.urls.get;
                while (result.status !== "succeeded" && result.status !== "failed" && result.status !== "canceled") {
                    // Wait 1.5 seconds between polls
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    const pollRes = await fetch(pollUrl, { headers });
                    result = await pollRes.json();
                }
                
                if (result.status === "failed") {
                    throw new Error(`Replicate prediction failed: ${result.error || "Unknown error"}`);
                }
            }

            return result;
        } catch (error) {
            console.error("OpenAI Adapter Generate Error:", error);
            throw error;
        }
    }
};

export default OpenAIAdapter;
