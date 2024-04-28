const router = require("express").Router();
const utils = require("../utils/multer")
const auth = require("./../middleware/auth");

const {
    userLogin,
    updateUser,
    getUserDetail,
    getUserProfession,
    userNotificationList,
    notificationCount,
    addAppVersion,
    versionAPi
} = require("../controller/C_user")

const {
    UserLoginDto
} = require("../dto/userDto")

// validation
const validateRequest = require("../middleware/validation");

router.post("/login",
 validateRequest(UserLoginDto),
 userLogin)

router.post("/update_user",
utils.upload ,
auth,
updateUser)

router.post("/getUserDetail",
auth,
getUserDetail)

router.post("/ProfessionList", getUserProfession )


router.post("/notificationList",
auth,
userNotificationList)

router.post("/notificationCount",
auth,
notificationCount)

router.post("/addAppVersion",addAppVersion)
router.post("/versionAPi",versionAPi)

module.exports = router;