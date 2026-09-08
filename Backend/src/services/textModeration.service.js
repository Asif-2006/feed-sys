const Groq = require("groq-sdk");
const { checkBlockedWords } = require("./blockedWord.service");
require("dotenv").config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function moderateCaption(caption) {
    try {
        // If caption is empty or only whitespace, it is safe by default
        if (!caption || !caption.trim()) {
            return {
                safe: true,
                violations: []
            };
        }

        // 1. Check local blocked words database first
        const blockedWordResult = await checkBlockedWords(caption);

        if (!blockedWordResult.safe) {
            return blockedWordResult;
        }

        // 2. Query Groq Content Moderation
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are a content moderation AI. Analyze the user's caption.
Possible violations:
- Hate Speech
- Harassment
- Sexual Content
- Violence
- Self Harm
- Bullying
- Threats

Return ONLY valid JSON:
If safe: {"safe": true, "violations": []}
If unsafe: {"safe": false, "violations": ["Harassment"]}`
                },
                {
                    role: "user",
                    content: caption
                }
            ],
            temperature: 0,
        });

        let content = response.choices[0]?.message?.content || "{}";
        content = content.trim();

        // Strip markdown code fences if present
        if (content.startsWith("```")) {
            content = content.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "").trim();
        }

        const parsed = JSON.parse(content);
        return {
            safe: parsed.safe !== false,
            violations: Array.isArray(parsed.violations) ? parsed.violations : []
        };

    } catch (err) {
        console.error("Text Moderation Error:", err.message);

        // Fallback: If AI moderation API fails/times out, rely on the database blocked word filter
        try {
            const fallbackCheck = await checkBlockedWords(caption);
            if (!fallbackCheck.safe) {
                return fallbackCheck;
            }
        } catch (dbErr) {
            console.error("Fallback DB check error:", dbErr.message);
        }

        // Allow post if no explicit blocked word matched
        return {
            safe: true,
            violations: []
        };
    }
}

module.exports = moderateCaption;