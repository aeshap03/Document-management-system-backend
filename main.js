const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const FCM = require("fcm-node");
const SERVER_KEY =
  "AAAAWsNigxU:APA91bGfGzMRrETSv4H3ISrn8tW3gaNFsn070a0Df6lCnJXIrMPM3C7KPTp2IMir8VHjMxMA4PO7Gy7TqmbTnQLnSq3xWeb0R1urfSN_H1GHA9dgLsD8X-mhtkc6prA4s98uJwYSMIZ5";
const UserDocument = require("./models/M_document");
const Notification = require("./models/M_notification");
const { dateTime } = require("./utils/date_time");
const userDevice = require("./models/M_userDevice");
const User = require("./models/M_user");
const moment = require("moment");

require("dotenv").config();
const port = process.env.PORT || 3000;

// configuration of cors
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Database file include.
require("./server/index")
  .connect()
  .then(async (data) => {
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use("/uploads", express.static(path.join("./uploads")));
    app.use(require("./routes/"));
  })
  .catch((error) => {
    console.log(error, "Error");
  });

/**
 * User notification count
 *
 * @author RxRooster |
 * @version 1.0
 * @since 1.0 date 28-09-2022
 * @description This API is Send notification
 * @method POST
 * @param Request $request
 * @return JsonResponse
 */

cron.schedule("0 */1 * * * *", async () => {
  const currentDateTime = await dateTime();

  let whereCondition = {
    is_deleted: false,
  };
  var data = await UserDocument.find().where(whereCondition);
  if (data.length === 0) {
    console.log("data not found");
  } else {
    for (var value of data) {
      var now = new Date();
      var current_date = moment(now).format("YYYY-MM-DD HH:mm");
      var format_date = moment(value.reminder_time).format("YYYY-MM-DD HH:mm");
      var expire_date = moment(value.expire_date).format("YYYY-MM-DD HH:mm");
      var notification_date = moment(value.notification_time).format(
        "YYYY-MM-DD HH:mm"
      );
      var notification_time = moment(value.notification_time).format("HH:mm");
      var current_time = moment(now).format("HH:mm");
      if (value.reminder_repeat === "Does not repeat") {
        // simple one time
        if (format_date === current_date) {
          var user_id = value.user_id;
          var doc_id = value.id;
          var valueData = await UserDocument.findOne({ _id: doc_id }).populate({
            path: "document_type",
            select: "Document_name",
          });
          var messageData = `Your document ${valueData.document_type.Document_name} is about to expire in some days.`;
          var title = valueData.document_type.Document_name;
          var description = messageData;
          var tokenData = await userDevice.find({ user_id: user_id });
          var fcm = new FCM(SERVER_KEY);
          const message = {
            to: tokenData[0].device_token,
            collapse_key: "TEST",
            notification: {
              title: title,
              body: description,
              sound: "default",
              delivery_receipt_requested: true,
            },
            data: {
              message: "hello",
            },
          };
          fcm.send(message, async (err, response) => {
            if (err) {
              console.log("error", err);
            } else {
              Notification.create({
                title,
                description,
                user_id,
                created_At: currentDateTime,
                updated_At: currentDateTime,
              });
              const findNotification = await User.findById(user_id);
              const addNotificationBadge = await User.findByIdAndUpdate(
                user_id,
                {
                  $set: {
                    notification_badge: findNotification.notification_badge + 1,
                  },
                },
                { new: true }
              );
              var documentId = value._id;
              const addNotificationTime = await UserDocument.findByIdAndUpdate(
                documentId,
                {
                  $set: {
                    notification_time: value.reminder_time,
                  },
                },
                { new: true }
              );
            }
          });
        }
      } else if (value.reminder_repeat === "Daily") {
        // daily one time
        if (notification_date === current_date && expire_date >= current_date) {
          if (notification_time == current_time) {
            var user_id = value.user_id;
            var doc_id = value.id;
            var valueData = await UserDocument.findOne({
              _id: doc_id,
            }).populate({
              path: "document_type",
              select: "Document_name",
            });
            var messageData = `Your document ${valueData.document_type.Document_name} is about to expire in some days.`;
            var title = valueData.document_type.Document_name;
            var description = messageData;
            var tokenData = await userDevice.find({ user_id: user_id });
            var fcm = new FCM(SERVER_KEY);
            const message = {
              to: tokenData[0].device_token,
              collapse_key: "TEST",
              notification: {
                title: title,
                body: description,
                sound: "default",
                delivery_receipt_requested: true,
              },
              data: {
                message: "hello",
              },
            };
            fcm.send(message, async (err, response) => {
              if (err) {
                console.log("error", err);
              } else {
                console.log("your Notification Send");
                Notification.create({
                  title,
                  description,
                  user_id,
                  created_At: currentDateTime,
                  updated_At: currentDateTime,
                });
                const findNotification = await User.findById(user_id);
                const addNotificationBadge = await User.findByIdAndUpdate(
                  user_id,
                  {
                    $set: {
                      notification_badge:
                        findNotification.notification_badge + 1,
                    },
                  }
                );
                var documentId = value._id;
                function addDays(dateTime, count_days = 0) {
                  return new Date(
                    new Date(dateTime).setDate(dateTime.getDate() + count_days)
                  );
                }
                var date = value.reminder_time;
                var tomorrow = addDays(date, 1);
                var finalDate = new Date(tomorrow).toISOString();
                const addNotificationTime =
                  await UserDocument.findByIdAndUpdate(documentId, {
                    $set: {
                      notification_time: finalDate,
                    },
                  });
              }
            });
          }
        }
      } else {
        if (notification_date === current_date && expire_date >= current_date) {
          if (notification_time === current_time) {
            var user_id = value.user_id;
            var doc_id = value.id;
            var valueData = await UserDocument.findOne({
              _id: doc_id,
            }).populate({
              path: "document_type",
              select: "Document_name",
            });
            var messageData = `Your document ${valueData.document_type.Document_name} is about to expire in some days.`;
            var title = valueData.document_type.Document_name;
            var description = messageData;
            var tokenData = await userDevice.find({ user_id: user_id });
            var fcm = new FCM(SERVER_KEY);
            const message = {
              to: tokenData[0].device_token,
              collapse_key: "TEST",
              notification: {
                title: title,
                body: description,
                sound: "default",
                delivery_receipt_requested: true,
              },
              data: {
                message: "hello",
              },
            };
            fcm.send(message, async (err, response) => {
              if (err) {
                console.log("error", err);
              } else {
                console.log("your Notification Send");
                Notification.create({
                  title,
                  description,
                  user_id,
                  created_At: currentDateTime,
                  updated_At: currentDateTime,
                });
                const findNotification = await User.findById(user_id);
                const addNotificationBadge = await User.findByIdAndUpdate(
                  user_id,
                  {
                    $set: {
                      notification_badge:
                        findNotification.notification_badge + 1,
                    },
                  }
                );
                var documentId = value._id;
                function addDays(dateTime, count_days = 0) {
                  return new Date(
                    new Date(dateTime).setDate(dateTime.getDate() + count_days)
                  );
                }
                var date = value.reminder_time;
                var tomorrow = addDays(date, 7);
                var finalDate = new Date(tomorrow).toISOString();
                const addNotificationTime =
                  await UserDocument.findByIdAndUpdate(documentId, {
                    $set: {
                      notification_time: finalDate,
                    },
                  });
              }
            });
          }
        }
      }
    }
  }
});

app.listen(port, () => {
  console.log(`server run on port number ${port}`);
});
