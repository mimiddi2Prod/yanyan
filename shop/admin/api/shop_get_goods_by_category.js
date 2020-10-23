// var tools = require("./tool");
var db = require("./../utils/dba");

function shopGetGoodsByCategory() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (param['category_id_1'].toString() == '') {
                console.info('category_id_1没有获取到')
            } else {
                sql = "select id,name from item where category_id_1 = ? and state != ?"
                row = await db.Query(sql, [param['category_id_1'], 2])
                if (row.length > 0) {
                    data = row
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetGoodsByCategory;