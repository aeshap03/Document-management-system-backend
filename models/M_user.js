const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    mobile_number : {
        type: String,
        length: [10, "Mobile number must be 10 digit."],
        required: [true, "Mobile number is required."],
    },
    country_code :{
        type: String
    },
    profile_picture : {
        type: String,
    },
    user_name : {
        type: String,
    },
    user_profession :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User_Profession",
    },
    is_deleted :{
        type: Boolean,
        enum: [true, false],
        default: false, // true-read, false-un read
    },
    is_verify: {
        type: Boolean,
        enum: [true, false],
        default: false, // true-Yes, false-No
    },
    notification_badge :{
        type: Number,
        default: "0"
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

userSchema.methods.toJSON = function () {
    const users = this;
    const usersObj = users.toObject();
    delete usersObj.__v;
    return usersObj;
};

module.exports = mongoose.model("User_detail", userSchema);

// userDetails
// user_details 