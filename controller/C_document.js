const UserDocument = require("../models/M_document");
const UserFileDocument = require("../models/M_file_document");
const FileType = require("../models/M_filetype");
const { successRes, errorRes } = require("./../utils/common_fun");
const { dateTime } = require("../utils/date_time");

/**
 * Add user document details
 *
 * @author RxRooster |
 * @version 1.0
 * @since 1.0 date 26-09-2022
 * @description This API is use for user add new document using document details
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */

const addUserDocument = async (req, res) => {
  try {
    let user_id = req.user._id;
    var {
      document_type,
      document_description,
      expire_date,
      reminder_date,
      reminder_time,
      reminder_repeat,
      file_type,
    } = req.body;
    const currentDateTime = await dateTime();

    var userDocument = await UserDocument.create({
      user_id,
      document_type: document_type,
      document_description,
      expire_date,
      reminder_date,
      reminder_time,
      reminder_repeat,
      notification_time: req.body.reminder_time,
      created_At: currentDateTime,
      updated_At: currentDateTime,
    });
    var documentId = userDocument.id;

    for (var value of req.files) {
      console.log(value.filename);

      var userFileDocument = await UserFileDocument.create({
        document_detail_id: documentId,
        user_id,
        file: "/uploads/user_document/" + value.filename,
        file_size: value.size,
        file_type: file_type,
        created_At: currentDateTime,
        updated_At: currentDateTime,
      });
    }
    var documentData = await UserDocument.findById(documentId)
      .select(
        "user_id document_type document_description expire_date reminder_date reminder_time reminder_repeat is_deleted created_At updated_At"
      )
      .populate({
        path: "user_id",
        select: "user_name",
      })
      .populate({
        path: "document_type",
        select: "Document_name",
      });

    // console.log("documentData",documentData)
    var fileData = await UserFileDocument.find({
      document_detail_id: documentId,
    });
    data = {
      ...documentData._doc,
      file: fileData,
      file_length: fileData.length,
    };

    if (data) {
      return successRes(res, "Document added successfully", data);
    } else {
      return errorRes(res, "Your details are not added");
    }
  } catch (error) {
    console.log(error);
    return errorRes(res, error.message);
  }
};

/**
 * Document type list
 *
 * @author RxRooster |
 * @version 1.0
 * @since 1.0 date 26-09-2022
 * @description This API is list of documents type for user select own document type
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */

const documentTypeList = async (req, res) => {
  try {
    var data = await FileType.find().select("Document_name");
    if (data) {
      return successRes(res, "Document types get successfully", data);
    } else {
      return errorRes(res, "Something went wrong.");
    }
  } catch (error) {
    return errorRes(res, error.message);
  }
};

/**
 * User document list
 *
 * @author RxRooster |
 * @version 1.0
 * @since 1.0 date 28-09-2022
 * @description This API is list of user all document
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */

/* const userDocumentList = async (req, res) => {
  let user_id = req.user._id;
  var document_description = req.body.document_description;
  let min_date = req.body.min_date;
  let max_date = req.body.max_date;

  try {
    let whereCondition = {
      is_deleted: false,
    };

    let insertData = { user_id: user_id };

    if (req.body.document_description != undefined) {
      insertData = {
        ...insertData._doc,
        $and: [
          { document_description: { $regex: req.body.document_description } },
          // {min_date: { $regex : req.body.min_date} },
        ],
      };
    }

    if (req.body.min_date != undefined) {
      insertData = {
        ...insertData._doc,
        $and: [{ expire_date: { $gte: req.body.min_date } }],
      };
    }

    if (req.body.max_date != undefined) {
      insertData = {
        ...insertData._doc,
        $and: [{ expire_date: { $lt: req.body.max_date } }],
      };
    }

    if (req.body.min_date != undefined && req.body.max_date != undefined) {
      insertData = {
        ...insertData._doc,
        $and: [
          { expire_date: { $gte: req.body.min_date, $lt: req.body.max_date } },
        ],
      };
    }

    if ( req.body.document_description != undefined && req.body.min_date != undefined) {
      insertData = {
        ...insertData._doc,
        "$and": [
          { document_description: { $regex: req.body.document_description } },
          { expire_date: { $gte: req.body.min_date, $lt: req.body.max_date } },
        ],
      };
    }

    if ( req.body.document_description != undefined && req.body.max_date != undefined) {
          insertData = {
            ...insertData._doc,
            "$and": [
              { document_description: { $regex: req.body.document_description } },
              { expire_date: { $lt: req.body.max_date, $lt: req.body.max_date } },
            ],
          };
        }


    var fileData = await UserDocument.find(insertData)
      .select(
        "user_id document_type document_description expire_date reminder_date reminder_time reminder_repeat is_deleted created_At updated_At"
      )
      .populate({
        path: "user_id",
        select: "user_name",
      })
      .populate({
        path: "document_type",
        select: "Document_name",
      })
      .where(whereCondition);
    // console.log(...fileData._doc)

    // const searchData = await UserDocument.find(
    //     {
    //         "$or" :[
    //             {document_description : { $regex : req.body.description} },
    //             // {min_date: { $regex : req.body.min_date} },
    //         ]
    //     }
    // )

    // console.log(searchData)
    // res.send(searchData)

    var data = [];
    if (fileData) {
      for (var value of fileData) {
        var filesData = await UserFileDocument.find({
          document_detail_id: value._id,
        }).where(whereCondition);
        value = {
          ...value._doc,
          file: filesData,
          file_length: filesData.length,
        };
        data.push(value);
      }
      return successRes(res, "Document list get successfully", data);
    } else {
      return errorRes(res, "Something went wrong.");
    }
  } catch (error) {
    return errorRes(res, error.message);
  }
}; */

const userDocumentList = async (req, res) => {
  let user_id = req.user._id;

  try {
    let whereCondition = {
      is_deleted: false,
    };
    var fileData = await UserDocument.find({ user_id: user_id })
      .select(
        "user_id document_type document_description expire_date reminder_date reminder_time reminder_repeat is_deleted created_At updated_At"
      )
      .populate({
        path: "user_id",
        select: "user_name",
      })
      .populate({
        path: "document_type",
        select: "Document_name",
      })
      .where(whereCondition)
      .sort({ created_At: -1 });
    // console.log(...fileData._doc)

    var data = [];
    if (fileData) {
      for (var value of fileData) {
        var filesData = await UserFileDocument.find({
          document_detail_id: value._id,
        }).where(whereCondition);
        value = {
          ...value._doc,
          file: filesData,
          file_length: filesData.length,
        };
        data.push(value);
      }
      return successRes(res, "Document list get successfully", data);
    } else {
      return errorRes(res, "Something went wrong.");
    }
  } catch (error) {
    return errorRes(res, error.message);
  }
};

/**
 * Get particular document details
 *
 * @author RxRooster |
 * @version 1.0
 * @since 1.0 date 28-09-2022
 * @description This API is show particular document list
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */

const documentDetails = async (req, res) => {
  var { doc_id } = req.body;
  try {
    let whereCondition = {
      is_deleted: false,
    };
    var data = await UserDocument.findById(doc_id)
      .select(
        "user_id document_type document_description expire_date reminder_date reminder_time reminder_repeat is_deleted created_At updated_At"
      )
      .populate({
        path: "user_id",
        select: "user_name",
      })
      .populate({
        path: "document_type",
        select: "Document_name",
      })
      .where(whereCondition);
    if (data) {
      var fileData = await UserFileDocument.find({
        document_detail_id: doc_id,
      }).where(whereCondition);
      data = { ...data._doc, file: fileData, file_length: fileData.length };
      return successRes(res, "Document details get successfully", data);
    } else {
      return errorRes(res, "Something went wrong.");
    }
  } catch (error) {
    return errorRes(res, error.message);
  }
};

/**
 * Update document details
 *
 * @author RxRooster |
 * @version 1.0
 * @since 1.0 date 29-09-2022
 * @description This API use for user update particular document details
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */

const updateUserDocument = async (req, res) => {
  const { document_id } = req.body;
  var file = req.files;
  var deleteFile = req.body.deleted_file;
  const currentDateTime = await dateTime();

  // console.log(document_id)
  // console.log(req.body)

  if (file == "" && deleteFile == undefined) {
    const update = await UserDocument.findByIdAndUpdate(document_id, {
      $set: {
        document_type: req.body.document_type,
        document_description: req.body.document_description,
        expire_date: req.body.expire_date,
        reminder_date: req.body.reminder_date,
        reminder_time: req.body.reminder_time,
        reminder_repeat: req.body.reminder_repeat,
        notification_time: req.body.reminder_time,
        updated_At: currentDateTime,
      },
    });
    if (update) {
      let whereCondition = {
        is_deleted: false,
      };
      let updatedData = await UserDocument.findById(document_id).populate({
        path: "document_type",
        select: "Document_name",
      });
      let fileDetails = await UserFileDocument.find({
        document_detail_id: document_id,
      }).where(whereCondition);
      data = {
        ...updatedData._doc,
        file: fileDetails,
        file_length: fileDetails.length,
      };

      return successRes(res, "Document saved successfully", data);
    } else {
      return errorRes(res, "your details are not saved");
    }
  } else if (req.body.deleted_file) {
    var array = req.body.deleted_file;
    var myArr = JSON.parse(array);

    for (var value of myArr) {
      const delete_file = await UserFileDocument.findByIdAndUpdate(
        { _id: value },
        {
          $set: { is_deleted: true },
        }
      );
    }

    let updates = await UserDocument.findByIdAndUpdate(
      { _id: document_id },
      {
        $set: {
          document_type: req.body.document_type,
          document_description: req.body.document_description,
          expire_date: req.body.expire_date,
          reminder_date: req.body.reminder_date,
          reminder_time: req.body.reminder_time,
          reminder_repeat: req.body.reminder_repeat,
          notification_time: req.body.reminder_time,
          updated_At: currentDateTime,
        },
      },
      { new: true }
    );

    // var flag = 1;

    for (var value of req.files) {
      // document_file.push("/uploads/user_document/"+value.filename)
      var userFileDocument = await UserFileDocument.create({
        document_detail_id: document_id,
        file: "/uploads/user_document/" + value.filename,
        file_size: value.size,
        file_type: req.body.file_type,
        created_At: currentDateTime,
        updated_At: currentDateTime,
      });
    }
    if (updates || userFileDocument) {
      let whereCondition = {
        is_deleted: false,
      };
      let update = await UserDocument.findById(document_id).populate({
        path: "document_type",
        select: "Document_name",
      });
      let fileDetails = await UserFileDocument.find({
        document_detail_id: document_id,
      }).where(whereCondition);
      data = {
        ...update._doc,
        file: fileDetails,
        file_length: fileDetails.length,
      };
      return successRes(res, "Document updated successfully", data);
    } else {
      return errorRes(res, "your details are not updated");
    }
  } else {
    let updates = await UserDocument.findByIdAndUpdate(
      { _id: document_id },
      {
        $set: {
          document_type: req.body.document_type,
          document_description: req.body.document_description,
          expire_date: req.body.expire_date,
          reminder_date: req.body.reminder_date,
          reminder_time: req.body.reminder_time,
          reminder_repeat: req.body.reminder_repeat,
          notification_time: req.body.reminder_time,
          updated_At: currentDateTime,
        },
      },
      { new: true }
    );

    for (var value of req.files) {
      // document_file.push("/uploads/user_document/"+value.filename)
      var userFileDocument = await UserFileDocument.create({
        document_detail_id: document_id,
        file: "/uploads/user_document/" + value.filename,
        file_size: value.size,
        file_type: req.body.file_type,
        created_At: currentDateTime,
        updated_At: currentDateTime,
      });
    }
    if (updates && userFileDocument) {
      let whereCondition = {
        is_deleted: false,
      };
      let update = await UserDocument.findById(document_id).populate({
        path: "document_type",
        select: "Document_name",
      });
      let fileDetails = await UserFileDocument.find({
        document_detail_id: document_id,
      }).where(whereCondition);
      data = {
        ...update._doc,
        file: fileDetails,
        file_length: fileDetails.length,
      };
      return successRes(res, "Document added successfully", data);
    } else {
      return errorRes(res, "your details are not added");
    }
  }
};

// let char_length = 5;

// var result = '';
// var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
// var charactersLength = characters.char_length;
// for ( var i = 0; i < char_length; i++ ) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
// }

// console.log(result);

/**
 * Delete document
 *
 * @author RxRooster |
 * @version 1.0
 * @since 1.0 date 29-09-2022
 * @description This API use for user delete particular document
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */

const deleteUserDocument = async (req, res) => {
  try {
    const { document_id } = req.body;
    const deleteDocument = await UserDocument.findByIdAndUpdate(
      { _id: document_id },
      {
        $set: { is_deleted: true },
      },
      { new: true }
    );
    const deleteFile = await UserFileDocument.updateMany(
      { document_detail_id: document_id },
      {
        $set: { is_deleted: true },
      },
      { new: true }
    );
    if (deleteDocument && deleteFile) {
      return successRes(res, "Your document deleted successfully..");
    } else {
      return errorRes(res, "Your document not delete. Please try again.!!");
    }
  } catch (error) {
    return errorRes(res, error.message);
  }
};

module.exports = {
  addUserDocument,
  documentTypeList,
  userDocumentList,
  documentDetails,
  updateUserDocument,
  deleteUserDocument,
};
