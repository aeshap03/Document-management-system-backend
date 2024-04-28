const Profession = require("../models/M_profession");
const DocumentType = require("../models/M_filetype");

const { successRes, errorRes } = require("../utils/common_fun");
const { dateTime }  = require("../utils/date_time")

/**
 * Add new profession 
 *
 * @author RxRooster | 
 * @version 1.0
 * @since 1.0 date 29-09-2022
 * @description This API is use add new profession 
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */

const addProfession = async(req,res) => {
    try {
        const currentDateTime = await dateTime();
        let {profession_name} = req.body

        var createProfession = await Profession.create({
            profession_name,
            created_At: currentDateTime,
            updated_At: currentDateTime
        })
            if(createProfession){
                return successRes(res, "New profession add successfully", createProfession); 
            }else{
                return errorRes(res, "New profession are not add"); 
            }
    } catch (error) {
        return errorRes(res, error.message); 
    }
}

/**
 * Add new documentType 
 *
 * @author RxRooster | 
 * @version 1.0
 * @since 1.0 date 29-09-2022
 * @description This API is use add new document type 
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */

const addDocumentType = async(req,res) => {
    try {
        const currentDateTime = await dateTime();
        let {Document_name} = req.body

        var createDocumentType = await DocumentType.create({
            Document_name,
            created_At: currentDateTime,
            updated_At: currentDateTime
        })
        if(createDocumentType){
            return successRes(res, "New document type added successfully", createDocumentType); 
        }else{
            return errorRes(res, "New document type are not added"); 
        }
    } catch (error) {
        return errorRes(res, error.message)
    }
}

module.exports = {
    addProfession,
    addDocumentType
}