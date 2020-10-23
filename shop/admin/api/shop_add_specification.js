// var tools = require("./tool");
var db = require("./../utils/dba");

function shopAddSpecification() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "insert into specification(`name`,create_time,user_id)values(?,CURRENT_TIMESTAMP,?)";
            row = await db.Query(sql, [param['name'], param['user_id']]);
            console.info(row)
            if (row.insertId) {
                data.text = '添加成功'
            } else {
                data.text = '添加失败'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopAddSpecification;