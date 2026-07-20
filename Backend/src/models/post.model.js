const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        image: {
            type: String,
            required: true,
        },
        imageFileId: {
            type: String,
            required: true
        },

        caption: {
            type: String,
            trim: true,
            default: "",
            maxlength: 2000,
        },
    },
    {
        timestamps: true,
    }
);
const postModel = mongoose.model("post", postSchema)


module.exports = postModel;




