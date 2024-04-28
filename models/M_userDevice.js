const mongoose = require("mongoose")

const userDeviceSchema = new mongoose.Schema({
    user_id :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User_detail",
        required: [true, "User id is required."],
    },
    device_token :{
        type: String,
    },
    device_type :{
        type: String,
        enum: ["ios", "android", "web"], // 1-ios, 2-android
    },
    app_version:{
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
    },
})

userDeviceSchema.methods.toJSON = function () {
    const userDevice = this;
    const userDeviceObj = userDevice.toObject();
    delete userDeviceObj.__v;
    return userDeviceObj;
};

module.exports = mongoose.model("User_device_detail", userDeviceSchema);