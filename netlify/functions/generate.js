const { GoogleGenAI } = require("@google/genai");

exports.handler = async function (event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({
                error: "Method not allowed"
            })
        };
    }

    try {
        const { type, topic, mood, genre } = JSON.parse(event.body);

        if (!topic) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Please provide a topic."
                })
            };
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is missing from Netlify environment variables.");
        }

        const ai = new GoogleGenAI({
            apiKey: apiKey
        });

        const prompt = `Create an original ${type}.

Topic: ${topic}
Mood: ${mood}
Genre: ${genre}

Make it creative, original, and appropriate.
Do not copy or reproduce existing copyrighted songs or poems.
Return only the generated ${type}.`;

        const interaction = await ai.interactions.create({
            model: "gemini-3.8-flash",
            input: prompt
        });

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                result: interaction.output_text
            })
        };

    } catch (error) {
        console.error("Gemini error:", error);

        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                error: error.message || "Unknown server error"
            })
        };
    }
};