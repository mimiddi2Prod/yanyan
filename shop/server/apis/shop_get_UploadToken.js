var tools = require("./../tool");
var qiniu = require("qiniu");
const qiniuConfig = require("./../config/qiniuConfig")

function SHOPGetUploadToken() {
    var tool = new tools;
    var log = tool.log;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetUploadToken::Run";
        var data = [];
        var response = tool.error.OK;
        try {
            var accessKey = qiniuConfig.accessKey;
            var secretKey = qiniuConfig.secretKey;
            var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
            var bucket = qiniuConfig.bucket;

            var keyToOverwrite = param.key;
            var options = {
                scope: bucket + ":" + keyToOverwrite,
            };
            var putPolicy = new qiniu.rs.PutPolicy(options);
            var uploadToken = putPolicy.uploadToken(mac);

            var list = {}

            list.uploadToken = uploadToken
            list.key = param.key
            list.tempFilePath = param.tempFilePath
            data = list
        } catch (err) {
            if (err.code) {
                response = tool.error.ErrorSQL;
                log.warn(name, "code:", err.code, ", sql:", err.sql);
            } else {
                log.warn(name, JSON.stringify(response));
                response = tool.error.ErrorCatch;
            }
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "get_uploadToken",
            }, res);
    }
}

module.exports = SHOPGetUploadToken;
