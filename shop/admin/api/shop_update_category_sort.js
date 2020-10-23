var db = require("./../utils/dba");
const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopUpdateCategorySort() {
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

            // let adImg = param["imgList"].map(function (res) {
            //     if (res.key) {
            //         return qiniuRootUrl + res.key
            //     }
            //     return res.tempFilePath
            // })
            // adImg = adImg[0]

            sql = "update category set sort = ? where id = ?";
            row = await db.Query(sql, [param['sort'], param['id']]);
            console.info(row)
            if (row.changedRows == 1) {
                data.code = 0
                data.text = '编辑成功'
            } else {
                data.code = 1
                data.text = '编辑失败'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopUpdateCategorySort;