
const OpenAIAdapter = {
    generate: async (model, messages) => {
        const url = model.link || "https://api.openai.com/v1/chat/completions";
        const apiToken = process.env.OPENAI_API_KEY;

        if (!apiToken) {
            throw new Error("Missing OPENAI_API_KEY in .env file.");
        }

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiToken}`
        };

        const body = {
            model: model.model_name,
            messages: Array.isArray(messages) ? messages : [messages]
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(`OpenAI API Error: ${response.status} - ${JSON.stringify(error)}`);
            }

            const result = await response.json();

            // Extract and return only the text content from the first choice
            if (result.choices && result.choices[0] && result.choices[0].message) {
                return result.choices[0].message.content;
            }

            return result;
        } catch (error) {
            console.error("OpenAI Adapter Generate Error:", error);
            throw error;
        }
    }
};

export default OpenAIAdapter;
