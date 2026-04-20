const sandboxConfig = require("../sandbox/config");

module.exports = {
  database: sandboxConfig.mongodb.uri,
  secret: sandboxConfig.jwt.secret,
};
