const router = require("express").Router();
const utils = require("../utils/document_file")
const auth = require("./../middleware/auth");

const  {
    addUserDocument,
    documentTypeList,
    userDocumentList,
    documentDetails,
    updateUserDocument,
    deleteUserDocument,
} = require("../controller/C_document")

const {
    DocumentDetailsDto
} = require("../dto/userDto")

// validation
const validateRequest = require("../middleware/validation");

router.post("/userDocumentAdd",
utils.upload, 
auth, 
validateRequest(DocumentDetailsDto),
addUserDocument)

router.post("/userDocumentType",documentTypeList)

router.post("/userDocumentList",auth,userDocumentList)
router.post("/documentDetails",auth,documentDetails)
router.post("/updateUserDocument",
auth,
utils.upload, 
updateUserDocument)


router.post("/deleteUserDocument",auth,deleteUserDocument)




module.exports = router;