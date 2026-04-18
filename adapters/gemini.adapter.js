/**
 * Adapter for Google Gemini models.
 */
const GeminiAdapter = {
    /**
     * @param {Object} model - The model definition (from DB)
     * @param {Object} inputs - Key-value pairs from the node attributes
     * @returns {Promise<Object>}
     */
    generate: async (model, inputs) => {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Missing GEMINI_API_KEY in .env file.");
        }

        // Construct standard Gemini REST URL if not provided or use the link
        let url = model.link;
        if (!url.includes("key=")) {
            url += (url.includes("?") ? "&" : "?") + `key=${apiKey}`;
        }

        // Map various possible prompt field names to Gemini's expected structure
        const prompt = inputs.prompt || inputs.text || inputs.messages || "";

        const payload = {
            contents: [
                {
                    parts: [
                        { text: typeof prompt === 'string' ? prompt : JSON.stringify(prompt) }
                    ]
                }
            ],
            generationConfig: {
                temperature: parseFloat(inputs.temperature) || 0.7,
                topP: parseFloat(inputs.top_p) || 0.9,
                maxOutputTokens: parseInt(inputs.max_completion_tokens) || 2048,
            }
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(`Gemini API Error: ${response.status} - ${JSON.stringify(error)}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Gemini Adapter Generate Error:", error);
            throw error;
        }
    }
};

export default GeminiAdapter;
