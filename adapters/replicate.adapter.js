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

        const url = model.link;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Token ${apiToken}`
        };

        // Replicate usually expects inputs to be wrapped in an 'input' object
        // If 'inputs' is already formatted (like messages), we adapt it
        const body = { 
            input: Array.isArray(inputs) ? { messages: inputs } : inputs 
        };

        try {
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

            // Handle asynchronous predictions (polling)
            if (result.urls && result.urls.get) {
                const pollUrl = result.urls.get;
                while (result.status !== "succeeded" && result.status !== "failed" && result.status !== "canceled") {
                    // Wait for the prediction to complete
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
            console.error("Replicate Adapter Generate Error:", error);
            throw error;
        }
    }
};

export default ReplicateAdapter;
