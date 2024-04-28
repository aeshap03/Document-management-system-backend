const mongoose = require("mongoose");

const version_schema = new mongoose.Schema({
  app_version: {
    type: String,
    // required: [true, "App version is required."],
  },
  is_maintenance: {
    type: Boolean,
    enum: [true, false],
    default: false, // true-Yes, false-No
  },
  app_update_status: {
    type: String,
    enum: ["is_force_update", "is_normal_update", "is_not_need_update", "is_review"],
    default: "is_not_need_update", // true-Yes, false-No
  },
  app_platform: {
    type: String,
    enum: ["ios", "android"],
    // required: [true, "App platform is required."], // ios, android
  },
  app_url: {
    type: String,
    // required: [true, "App URL is required."],
  },
  is_live: {
    type: Boolean,
    enum: [true, false],
    default: false, // true-Live, false-Not_live
  },
  is_deleted: {
    type: Boolean,
    enum: [true, false],
    default: false, // true-deleted, false-Not_deleted
  },
  created_At: {
    type: Date,
    required: [true, "Create date is required."],
  },
  updated_At: {
    type: Date,
    required: [true, "Update date is required."],
  },
});

version_schema.methods.toJSON = function () {
  const users = this;
  const usersObj = users.toObject();
  delete usersObj.__v;
  return usersObj;
};

module.exports = mongoose.model("App_version", version_schema);
