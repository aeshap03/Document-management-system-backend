const router = require("express").Router();


const users = require("./R_user");
const document = require("./R_document");
const list = require("./R_createList")

router.use("/RxRooster/users", users);
router.use("/RxRooster/document", document);
router.use("/RxRooster/list",list)

module.exports = router;