const Groq = require("groq-sdk");
const { checkBlockedWords } = require("./blockedWord.service");
require("dotenv").config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function moderateCaption(caption) {
    try {

        const blockedWordResult = await checkBlockedWords(caption);

        if (!blockedWordResult.safe) {
            return blockedWordResult;
        }

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `
You are a content moderation AI.

Analyze the user's caption.

Possible violations:
- Hate Speech
- Harassment
- Sexual Content
- Violence
- Self Harm
- Bullying
- Threats

Return ONLY valid JSON.

If safe:
{
    "safe": true,
    "violations": []
}

If unsafe:
{
    "safe": false,
    "violations": ["Harassment"]
}
`
                },
                {
                    role: "user",
                    content: caption
                }
            ],
            temperature: 0,
        });

        const content = response.choices[0].message.content;

        console.log(content);

        return JSON.parse(content);

    } catch (err) {
        console.error("Text Moderation Error:", err);

        return {
            safe: false,
            serviceError: true,
            violations: ["Unable to verify caption safety."]
        };
    }
}

module.exports = moderateCaption;