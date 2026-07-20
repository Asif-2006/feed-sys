const axios = require("axios");
const FormData = require("form-data");
const THRESHOLD = 0.7;
async function moderateImage(buffer) {

    try {
        const form = new FormData();

        form.append("media", buffer, {
            filename: "image.jpg",
            contentType: "image/jpeg",
        });

        form.append("models", "nudity-2.1");
        form.append("api_user", process.env.SIGHTENGINE_API_USER);
        form.append("api_secret", process.env.SIGHTENGINE_API_SECRET);

        const response = await axios.post(
            process.env.SIGHTENGINE_API_URL,
            form,
            {
                headers: form.getHeaders(),
            }
        );

        const nudity = response.data.nudity;

        const violations = [];

        if (nudity.sexual_activity > THRESHOLD) {
            violations.push("Sexual activity detected.");
        }

        if (nudity.sexual_display > THRESHOLD) {
            violations.push("Explicit nudity detected.");
        }

        if (nudity.erotica > THRESHOLD) {
            violations.push("Erotic content detected.");
        }
        if (violations.length > 0) {
            return {
                safe: false,
                violations
            };
        }

        return {
            safe: true,
            violations: []
        };
    } catch (err) {
        console.error("Moderation Error:", err.message);

        return {
            safe: false,
            violations: ["Unable to verify image safety."]
        };
    }
}

module.exports = moderateImage;