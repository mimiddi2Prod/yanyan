var db = require("./../utils/dba");
const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopUpdateBrunchBannerStatus() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "update restaurant_banner set status = ? where id = ?";
            row = await db.Query(sql, [param['status'], param['id']]);
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

module.exports = shopUpdateBrunchBannerStatus;