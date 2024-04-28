const mongoose = require("mongoose");

const fileTypeSchema = new mongoose.Schema({
    Document_name : {
        type: String,
    },
    is_deleted :{
        type: Boolean,
        enum: [true, false],
        default: false, // true-read, false-un read
    },
    created_At: {
        type: Date,
        required: [true, "Create date is required."],
    },
    updated_At: {
        type: Date,
        required: [true, "Update date is required."],
    }
})

fileTypeSchema.methods.toJSON = function () {
    const fileType = this;
    const fileTypeObj = fileType.toObject();
    delete fileTypeObj.__v;
    return fileTypeObj;
};

module.exports = mongoose.model("document_type", fileTypeSchema);