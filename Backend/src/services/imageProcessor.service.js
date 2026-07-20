const sharp = require("sharp");

async function compressImage(buffer) {
    return await sharp(buffer)
        .resize({
            width: 1080,
            withoutEnlargement: true
        })
        .webp({
            quality: 80,
        })
        .toBuffer();
}

module.exports = compressImage;