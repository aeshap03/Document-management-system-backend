const User = require("../models/M_user")
const userDevice = require("../models/M_userDevice")
const Profession = require("../models/M_profession")
const Notification = require("../models/M_notification")
const appVersion = require("../models/M_app_version");

const { dateTime }  = require("../utils/date_time")
const { successRes, errorRes } = require("./../utils/common_fun")
const { playerToken } = require("./../utils/token");
const { findOne, findById } = require("../models/M_document");


/**
 * Login User
 *
 * @author RxRooster | 
 * @version 1.0
 * @since 1.0 date 22-09-2022
 * @description This API is user for user login in our system using with contact number
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */

const userLogin = async (req,res) => {
    try {
        const currentDateTime = await dateTime();
        let { mobile_number , is_verify, device_token, device_type, country_code } = req.body
        
        let findUser = await User.findOne({
            mobile_number: mobile_number,
            country_code: country_code
        })
        
        if(!findUser){
            let newUser = await User.create({
                mobile_number,
                country_code,
                is_verify,
                created_At: currentDateTime,
                updated_At: currentDateTime
            })
            
            let newDevice = await userDevice.create({
                user_id: newUser.id,
                device_token,
                device_type,
                created_At: currentDateTime,
                updated_At: currentDateTime
            })

            const token = await playerToken(newUser);
            var userData = await User.findById(newUser.id).select('mobile_number country_code is_deleted is_verify created_At updated_At')
            newUser = {...userData._doc,device_token:newDevice.device_token,device_type:newDevice.device_type,token:token }
            return successRes(res, `User SignUp successfully`, newUser); 
        }
        else{
            let findUser = await User.findOne({
                mobile_number: mobile_number,
                country_code: country_code 
            })
           
            var user_id = findUser._id
            let updateData = {
                is_verify,
                updated_At: currentDateTime
            }
            let userDetail = await User.findByIdAndUpdate(user_id, updateData,{new:true}).select('mobile_number country_code is_deleted is_verify created_At updated_At');
            
            let query = {
                user_id : user_id
              };
              let deviceUpdate = {
                $set: {
                    device_token,
                    device_type,
                    updated_At : currentDateTime
                },
              };
              let options = { upsert: true, new: true };
              let deviceDetail = await userDevice.updateOne(query, deviceUpdate, options);
            
            // let findDevice = await userDevice.findOne({  
            //     user_id : user_id
            // })
            // console.log(findDevice)
            // let deviceId = findDevice._id
            // let deviceUpdate = {
            //     device_token,
            //     device_type,
            //     updated_At : currentDateTime
            // }
            // let deviceDetail = await userDevice.findByIdAndUpdate(deviceId, deviceUpdate,{new:true}) 
            
            const token = await playerToken(userDetail);
            userDetail = {...userDetail._doc, device_token:deviceDetail.device_token, device_type:deviceDetail.device_type,token:token};
            return successRes(res, `User SignUp successfully`, userDetail); 
        }
    } catch (error) {
        console.log(error)
        return errorRes(res, error.message);
    }
}


/**
 * Add user details
 *
 * @author RxRooster | 
 * @version 1.0
 * @since 1.0 date 22-09-2022
 * @description This API is user for user Add own Details in our system using Profile_picture,User_name,Profession,
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */


const updateUser = async(req,res) => {
    try {
        var currentDateTime = await dateTime();
        // let {user_id } = req.body

        let user_id = req.user._id;
        var file = req.file
        var findUser = await User.findOne({
            _id: user_id
        })
            if(findUser){
                if(file === undefined){
                    const update = await User.findByIdAndUpdate({_id: user_id}, {
                        $set: {
                            user_name: req.body.user_name,
                            user_profession: req.body.user_profession,
                            updated_At: currentDateTime
                        }
                    }, { new: true }).populate({path:"user_profession", select:"profession_name"})
                    if(update){
                        data = {...update._doc}
                        return successRes(res, "User details updated successfully", data); 
                    }else{
                        return errorRes(res, "your details are not Updated"); 
                    }
                }
                else{
                    const fileUpdate = await User.findByIdAndUpdate({_id: user_id}, {
                        $set: {
                            profile_picture: `/uploads/user_profile/${req.file.filename}`,
                            user_name: req.body.user_name,
                            user_profession: req.body.user_profession,
                            updated_At: currentDateTime
                        }
                    }, { new: true }).populate({path:"user_profession", select:"profession_name"})
                    if(fileUpdate){
                        data = {...fileUpdate._doc}
                        return successRes(res, "User details updated successfully", data); 
                    }else{
                        return errorRes(res, "your details are not Updated"); 
                    }
                }
                
            }
    } catch (error) {
        return errorRes(res, error.message); 
    }
}


/**
 * Get user details
 *
 * @author RxRooster | 
 * @version 1.0
 * @since 1.0 date 23-09-2022
 * @description This API is show user personal information
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */

const getUserDetail = async(req,res) => {
    try {
        let user_id = req.user._id;
        let userData = await User.findById(user_id).populate({path: "user_profession",select:"profession_name"});
        if(userData){
            return successRes(res, "User details get successfully", userData); 
        }
        else{
            return errorRes(res, "User not found"); 
        }
    } catch (error) {
        return errorRes(res,error.message);
    }
}


/**
 * User profession list
 *
 * @author RxRooster | 
 * @version 1.0
 * @since 1.0 date 23-09-2022
 * @description This API is list of user profession for select user own profession 
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */

const getUserProfession = async(req,res) => {
    try {
        var professionData = await Profession.find().select('profession_name')
        if(professionData){
            return successRes(res, "profession list get successfully", professionData);
        }else{
            return errorRes(res, "not found "); 
        } 

    } catch (error) {
        return errorRes(res,error.message)
    }
}

/**
 * User notification list
 *
 * @author RxRooster | 
 * @version 1.0
 * @since 1.0 date 28-09-2022
 * @description This API is list of user's notification
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */

 const userNotificationList = async(req,res) => {
     try{
        let user_id = req.user._id;
        var notificationData = await Notification.find({user_id:user_id, is_deleted: false,});
        
        const notificationCount = await User.findByIdAndUpdate({_id : user_id},{
            $set: {
              notification_badge: "0"
            }
        },{ new: true })
        // console.log("notificationData",notificationData)
        notificationData.sort(function (a, b) {
            return new Date(b.created_At) - new Date(a.created_At);
        });
        return successRes(res, "Notification list get successfully", notificationData);
        
    }catch(error){
        return errorRes(res,error.message);
    }
}

/**
 * User notification count
 *
 * @author RxRooster | 
 * @version 1.0
 * @since 1.0 date 28-09-2022
 * @description This API is list of user's notification count
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */

const notificationCount = async(req,res) => {
    try {
        let user_id = req.user._id;
        var notificationCount = await User.findById(user_id).select("notification_badge")
        return successRes(res, "Notification list get successfully", notificationCount);

    } catch (error) {
        return errorRes(res,error.message);
    }
}

//version api ("not needed") 

const addAppVersion = async (req, res) => {
  try {
    let { app_version, is_maintenance, app_platform, app_url } =
      req.body;

    const currentDateTime = await dateTime();

    let insertQry = await appVersion.create({
      app_version,
      is_maintenance,
      app_platform,
      app_url,
      created_At: currentDateTime,
      updated_At: currentDateTime,
    });

    return await successRes(res, `App version added`, insertQry);
  } catch (error) {
    return errorRes(res, error.message);
  }
};

/**
 * User notification count
 *
 * @author RxRooster | 
 * @version 1.0
 * @since 1.0 date 28-09-2022
 * @description This API is version check api 
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */

const versionAPi = async(req,res) => {
    try{
        const {app_platform , application_version} = req.body
        const user_id = req.body.user_id
    if(application_version == ''){
        return errorRes(res,"Please enter application version.");
    }
    if(app_platform == ''){
        return errorRes(res,"Please enter platform name.");
    }

    
    if(user_id == undefined){
        var whereCondition = {
            app_version: application_version,
            is_live: true,
            app_platform: app_platform,
            is_deleted: false
        }
        const VersionData = await appVersion.findOne().where(whereCondition)
        if(VersionData){
            return await successRes(res, `Version updated successfully`, VersionData);
        }else{
            const LiveVersionData = await appVersion.findOne().where({
                is_live: true,
                app_platform: app_platform,
                is_deleted: false
            })
    
            return await successRes(res, `Version updated successfully`, LiveVersionData);  
        }
        
    }else{
        const version = await userDevice.find({user_id:user_id })
        var id = version[0]._id
        const addUserVersion = await userDevice.findByIdAndUpdate({_id:id }, {
        $set:{
            app_version: application_version
        }
    })
    var whereCondition = {
        app_version: application_version,
        is_live: true,
        app_platform: app_platform,
        is_deleted: false
    }
    const VersionData = await appVersion.findOne().where(whereCondition)
        if(VersionData){
            return await successRes(res, `Version updated successfully`, VersionData);
        }else{
            const LiveVersionData = await appVersion.findOne().where({
                is_live: true,
                app_platform: app_platform,
                is_deleted: false
            })
    
            return await successRes(res, `Version updated successfully`, LiveVersionData);  
        }
    }

    }
    catch(error){
        return errorRes(res, error.message);
    }
}

module.exports = {
    userLogin,
    updateUser,
    getUserDetail,
    getUserProfession ,
    userNotificationList,
    notificationCount,
    addAppVersion,
    versionAPi
}
