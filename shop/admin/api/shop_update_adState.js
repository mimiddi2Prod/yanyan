var db = require("./../utils/dba");

function shopUpdateAdState() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var data = {}
        var row = []
        var sql = ""
        try {
            sql = "update advertisement set state = ? where id = ?"
            row = await db.Query(sql, [param["state"], param["ad_id"]])
            if (row.changedRows == 1) {
                data = "更新广告状态成功"
            }
            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }

    }
}

module.exports = shopUpdateAdState;