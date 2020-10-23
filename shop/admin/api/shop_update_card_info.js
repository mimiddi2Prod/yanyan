var db = require("./../utils/dba");
const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopUpdateCardInfo() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "update card_info set type = ?,status = ? where id = ?";
            row = await db.Query(sql, [param['type'], param['is_del'], param['id']]);
            console.info(row)
            if (row.changedRows == 1) {
                data.text = '更新成功'
            } else {
                data.text = '更新失败'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopUpdateCardInfo;
