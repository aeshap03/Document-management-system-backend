const successRes = async (res, msg, data) => {
    return res.send({
      success: true,
      statuscode: 1,
      message: msg,
      data: data,
    });
  };
  
  const errorRes = async (res, msg) => {
    return res.send({
      success: false,
      statuscode: 0,
      message: msg,
    });
  };
  
  module.exports = { successRes, errorRes };
  