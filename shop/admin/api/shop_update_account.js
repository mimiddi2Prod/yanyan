var db = require("./../utils/dba");

function shopUpdateAccount() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "update admin set username = ?,nick_name = ?,cate = ?,brand = ?,`order` = ?,recommend = ?,navigation = ?,waterfall = ? where id = ?"
            row = await db.Query(sql, [param['login_name'], param['nick_name'], JSON.stringify(param['cate']), JSON.stringify(param['brand']),param['order'],param['recommend'],param['navigation'],param['waterfall'], param['id']]);
            console.info(row)
            if (row.changedRows) {
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

module.exports = shopUpdateAccount;