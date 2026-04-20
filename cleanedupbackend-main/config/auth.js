const jwt = require("jsonwebtoken");
const sandboxConfig = require("../sandbox/config");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, sandboxConfig.jwt.secret);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Authentification Failed",
    });
  }
};
