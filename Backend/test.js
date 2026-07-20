const compressedBuffer = await compressImage(req.file.buffer);

console.log(
    "Original:",
    (req.file.buffer.length / 1024 / 1024).toFixed(2),
    "MB"
);

console.log(
    "Compressed:",
    (compressedBuffer.length / 1024 / 1024).toFixed(2),
    "MB"
);