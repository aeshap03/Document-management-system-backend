const jwt = require("jsonwebtoken");
const User = require("../models/M_user");
const { errorRes } = require("././../utils/common_fun");

const verifyToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader)
      throw new Error(`A token is required for authentication.`);

    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    const { id } = jwt.verify(bearerToken, process.env.TOKEN_KEY);

    // Find customer.
    const findUsers = await User.findById(id);

    if (!findUsers) throw new Error("Authentication failed.");
    req.user = findUsers;
    next();
  } catch (error) {
    return await errorRes(res, error.message);
  }
};

module.exports = verifyToken;
