const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User_detail",
        required: [true, "User id is required."],
    },
    document_type:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "document_type",
        required: [true, "document type id is required."],
    },
    document_description:{
        type: String
    },
    expire_date:{
        type:String
    },
    reminder_date:{
        type:Date
    },
    reminder_time:{
        type: Date
    },
    reminder_repeat:{
        type: String,
        enum: ["Does not repeat", "Daily", "Weekly"], 
    },
    notification_time:{
        type: Date
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

DocumentSchema.methods.toJSON = function () {
    const document = this;
    const documentObj = document.toObject();
    delete documentObj.__v;
    return documentObj;
};

module.exports = mongoose.model("document_detail", DocumentSchema);
