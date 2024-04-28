const jwt = require("jsonwebtoken");

const playerToken = async (findCustomer) => {
  const data = jwt.sign({ id: findCustomer._id }, process.env.TOKEN_KEY);
  return data;
};

module.exports = { playerToken };
