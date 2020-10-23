// var tools = require("./tool");
var db = require("./../utils/dba");

function shopUpdateIntegral() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (!param["integral"]) {
                // response = tool.error.ErrorNotOpId;
                console.info(name, 'integral is not defined')
            } else if (!param["state"].toString()) {
                // response = tool.error.ErrorUserType;
                console.info(name, "state is not defined");
            } else if (!param["user_id"]) {
                console.info(name, "user_id is not defined");
            } else {
                sql = "select integral from `user` where id = ?"
                row = await db.Query(sql, param["user_id"])
                if (row.length > 0) {
                    let currentIntegral = row[0].integral
                    param["integral"] = Number(param["integral"] / 100)
                    // 0相加 1相减
                    if (param['state'] == 0) {
                        currentIntegral = currentIntegral + param["integral"]
                    } else {
                        currentIntegral = currentIntegral - param["integral"]
                    }
                    sql = "update `user` set integral = ? where id = ?"
                    row = await db.Query(sql, [currentIntegral, param["user_id"]])
                    if (row.changedRows == 1) {
                        data.text = "积分更新成功"
                    }
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopUpdateIntegral;