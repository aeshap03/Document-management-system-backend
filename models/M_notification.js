const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
     title:{
        type: String
     },
     description:{
        type: String
     },
     user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User_detail",
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

notificationSchema.methods.toJSON = function () {
    const notification = this;
    const notificationObj = notification.toObject();
    delete notificationObj.__v;
    return notificationObj;
};

module.exports = mongoose.model("User_Notification", notificationSchema);