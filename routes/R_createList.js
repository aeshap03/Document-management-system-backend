const router = require("express").Router();


const {
    addProfession,
    addDocumentType
} = require("../controller/C_createList")

router.post("/addProfession",addProfession)
router.post("/addDocumentType",addDocumentType)

module.exports = router;