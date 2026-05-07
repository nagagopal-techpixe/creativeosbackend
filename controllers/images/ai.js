import axios from "axios";

const genrateimage = {
    genrate: async (messages,model) => {
        try {
            const apiToken = process.env.REPLICATE_API_TOKEN;
            console.log(messages)

            if (!apiToken) {
                throw new Error("Missing REPLICATE_API_TOKEN in .env file");
            }

            // -----------------------------
            // Extract Prompt
            // -----------------------------
            let promptText = "";

            if (typeof messages === "string") {
                promptText = messages;
            } else if (Array.isArray(messages) && messages.length > 0) {
                const content = messages[0]?.content;

                if (Array.isArray(content)) {
                    promptText = content
                        .map((c) =>
                            typeof c === "string"
                                ? c
                                : c.text || JSON.stringify(c)
                        )
                        .join(" ");
                } else {
                    promptText = content || "";
                }
            }

            // -----------------------------
            // Default & Clean Prompt
            // -----------------------------
            let cleanPrompt = (promptText || "").toString().trim();

            if (!cleanPrompt || cleanPrompt === "" || cleanPrompt === "undefined") {
                console.log("Detected empty or 'undefined' prompt, falling back to default.");
                cleanPrompt = `Type: Product hero — product centred, clean composition, commercial photography.
                Subject: diverse multiracial group, man in his 20s-30s.
                Pose: crossed arms pose, flying in air, hands in pocket, walking toward camera, pointing toward camera, power charging pose, mid-jump action.
                Framing: full body shot.
                Setting: smartphone showroom.
                Style: cinematic poster style, dramatic composition.
                Lighting: neon glow light.
                Camera/Lens: 50mm portrait lens.
                Expression: serious intense stare.
                Details/Textures: sharp hair strands.
                Promo Effects: product glow reflection on face.
                Format: 9:16 vertical portrait format.`;
            }

            const url = model.link;
            console.log("Prompt Sent To Replicate:", cleanPrompt);

            // -----------------------------
            // Replicate API Request
            // -----------------------------
          const response = await fetch(
                url,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Token ${apiToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        input: {
                            prompt: cleanPrompt
                        }
                    })
                }
            );

            const data = await response.json();

            console.log(
                "Initial Replicate Response:",
                JSON.stringify(data, null, 2)
            );

            if (!response.ok) {
                throw new Error(
                    `Replicate API Error: ${response.status} - ${JSON.stringify(
                        data
                    )}`
                );
            }

            // -----------------------------
            // Poll Until Completed
            // -----------------------------
            let prediction = data;

            while (
                prediction.status !== "succeeded" &&
                prediction.status !== "failed" &&
                prediction.status !== "canceled"
            ) {
                console.log("Waiting for image generation...");

                await new Promise((resolve) => setTimeout(resolve, 2000));

                const pollResponse = await axios.get(prediction.urls.get, {
                    headers: {
                        Authorization: `Token ${apiToken}`
                    }
                });

                prediction = pollResponse.data;

                console.log(
                    "Polling Status:",
                    prediction.status
                );
            }

            // -----------------------------
            // Handle Failure
            // -----------------------------
            if (prediction.status === "failed") {
                throw new Error(
                    prediction.error || "Image generation failed"
                );
            }

            // -----------------------------
            // Final Image URL
            // -----------------------------
            const output = prediction.output;

            const imageUrl = Array.isArray(output)
                ? output[0]
                : output;

            console.log("Generated Image URL:", imageUrl);

            return imageUrl;

        } catch (error) {
            console.error(
                "Replicate API Error:",
                error.response?.data || error.message
            );

            throw error;
        }
    }
};

export default genrateimage;