const path = require("path");
const multer = require("multer");
const fs = require("fs");
const logDir = "uploads/user_document";

const filePath = path.resolve(__dirname + "./../" + logDir);

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath);
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, filePath);
  },

  filename: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    cb(null, file.originalname+"_"+Date.now() + ext);
  },
});

var upload = multer({ storage: storage }).any()

module.exports = { upload };
