const Joi = require("joi")

const UserLoginDto = Joi.object().keys({
    mobile_number: Joi.string()
    .length(10) 
    .required()
    .messages({
      "string.length": `Valid only 10 digit mobile number!`,
    })
    .label("Mobile number"),
    is_verify: Joi.boolean().default(false).required().label("Mobile verify"),
    device_token: Joi.string().required().label("Device Token"),
    device_type: Joi.string()
    .length(6)
    .valid("ios", "android", "web")
    .required()
    .label("Device Type"),
    country_code: Joi.string().required().label("country code")
})

const DocumentDetailsDto = Joi.object().keys({
    document_type: Joi.string().required().label("document_type"),
    document_description:Joi.string().required().label("document_description"),
    expire_date: Joi.string().required().label("expire_date"),
    reminder_date:Joi.string().required().label("reminder_date"),
    reminder_time:Joi.string().required().label("reminder_time"),
    reminder_repeat:Joi.string()
    .required()
    .valid("Does not repeat","Daily","Weekly")
    .label("reminder_repeat"),
    file_type:Joi.string().required().label("file_type"),
})

module.exports = {
    UserLoginDto,
    DocumentDetailsDto
}