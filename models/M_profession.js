const mongoose = require("mongoose")

const ProfessionSchema = new mongoose.Schema({
     profession_name:{
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
    }

})

ProfessionSchema.methods.toJSON = function () {
    const profession = this;
    const professionObj = profession.toObject();
    delete professionObj.__v;
    return professionObj;
};

module.exports = mongoose.model("User_Profession", ProfessionSchema);