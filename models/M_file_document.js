const mongoose = require("mongoose")

const FileSchema = new mongoose.Schema({
    document_detail_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "document_detail",
        required: [true, "document_detail_id is required."],
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User_detail",
    },
    file:{
        type: String,
        require : [true, "user document file is required"]
    },
    file_type:{
        type: String,
        require : [true, "file type is required"]
    },
    file_size:{
        type: String,
        require: [true, "file size is required"]
    },
    file_length:{
        type: String
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
    },


})

FileSchema.methods.toJSON = function () {
    const file = this;
    const fileObj = file.toObject();
    delete fileObj.__v;
    return fileObj;
};
module.exports = mongoose.model("user_file_document", FileSchema);