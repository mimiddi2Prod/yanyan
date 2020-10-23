var db = require("./../utils/dba");
const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopUpdateAd() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            // var qiniuRootUrl = "http://notwastingqiniu.minidope.com/"
            // 单张图上传
            // var img = qiniuRootUrl + param['imgList'][0]

            let adImg = param["imgList"].map(function (res) {
                if (res.key) {
                    return qiniuRootUrl + res.key
                }
                return res.tempFilePath
            })
            adImg = adImg[0]

            sql = "update advertisement set image = ?,url = ?,text = ?,user_id = ?,create_time = CURRENT_TIMESTAMP,state = ?,sort = ?,`type` = ? where id = ?";
            row = await db.Query(sql, [adImg, param['url'], param['text'], param['user_id'], param['state'], param['sort'], param['type'], param['id']]);
            console.info(row)
            if (row.changedRows == 1) {
                data.text = '编辑成功'
            } else {
                data.text = '编辑失败'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopUpdateAd;