const { errorRes } = require("./../utils/common_fun");

const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const option = {
        abortEarly: false,
        errors: {
          wrap: {
            label: "",
          },
        },
      };
      const { error } = await schema.validate(req.body, option);

      if (error) {
        throw error;
      }
      next();
    } catch (error) {

      let errorMsg = error.details[0].message;

      return errorRes(res, errorMsg);
    }
  };
};

module.exports = validateRequest;
