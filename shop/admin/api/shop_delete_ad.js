var db = require("./../utils/dba");

function shopDeleteAd() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "delete from advertisement where id = ?";
            row = await db.Query(sql, param['ad_id']);
            console.info(row)
            if (row.affectedRows == 1) {
                data.text = '删除成功'
            } else {
                data.text = '删除失败'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopDeleteAd;