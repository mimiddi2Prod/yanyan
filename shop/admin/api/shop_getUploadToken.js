// var qiniu = require("qiniu");
// const qiniuConfig = require("./../config/qiniuConfig")
var getToken = require("./../utils/qiniuUploadToken")

function getUploadToken() {
    this.Service = async function (version, param, callback) {
        var data = {}
        try {
            let token = await getToken(param['key'])
            data.uploadToken = token
            data.key = param['key']
            data.tempFilePath = param['tempFilePath']

            // var accessKey = qiniuConfig.accessKey;
            // var secretKey = qiniuConfig.secretKey;
            // var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
            // var bucket = qiniuConfig.bucket;
            //
            // var keyToOverwrite = param['key'];
            // var options = {
            //     scope: bucket + ":" + keyToOverwrite,
            // };
            // var putPolicy = new qiniu.rs.PutPolicy(options);
            // var uploadToken = putPolicy.uploadToken(mac);
            // data.uploadToken = uploadToken
            // data.key = param['key']
            // data.tempFilePath = param['tempFilePath']
            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = getUploadToken;