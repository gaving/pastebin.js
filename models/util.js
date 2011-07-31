var crypto = require("crypto");

var ipHash = function(ip) {
    return crypto.createHash("md5").update(ip).digest("hex");
};

exports.ipHash = ipHash;
