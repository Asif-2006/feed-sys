const ImageKit  = require('@imagekit/nodejs');
require("dotenv").config();


const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});


async function uploadFile(buffer) {
    const result = await imageKit.files.upload({
        file: buffer.toString("base64"),
        fileName: `${Date.now()}.jpg`,
    });

    return {
        url: result.url,
        fileId: result.fileId
    };
}

async function deleteFile(fileId) {
    await imageKit.files.delete(fileId);
}

module.exports = {
    uploadFile,
    deleteFile
};
