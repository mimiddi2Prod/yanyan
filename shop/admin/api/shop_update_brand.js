var db = require("./../utils/dba");
const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopUpdateBrand() {
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

            let brandImg = param["imgList"].map(function (res) {
                if (res.key) {
                    return qiniuRootUrl + res.key
                }
                return res.tempFilePath
            })
            brandImg = brandImg[0]
            sql = "update brand set image = ?,url = ?,name = ?,price = ?,user_id = ?,create_time = CURRENT_TIMESTAMP,state = ?,sort = ?,`desc` = ? where id = ?";
            row = await db.Query(sql, [brandImg, param['url'], param['name'], param['price'], param['user_id'], param['state'], param['sort'], param['desc'], param['id']]);
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

module.exports = shopUpdateBrand;