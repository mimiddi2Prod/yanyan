var qiniu = require("qiniu");
const qiniuConfig = require("./../config/qiniuConfig")

module.exports = async function getToken(key) {
    var accessKey = qiniuConfig.accessKey;
    var secretKey = qiniuConfig.secretKey;
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var bucket = qiniuConfig.bucket;

    var keyToOverwrite = key;
    var options = {
        scope: bucket + ":" + keyToOverwrite,
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    // data.uploadToken = uploadToken
    return uploadToken
}
