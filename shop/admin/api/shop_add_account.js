var db = require("./../utils/dba");

function shopAddAccount() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            // sql = "insert into admin(username,password,nick_name,register_time,last_login_time,`type`,position_id)values(?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,?,?)";
            // row = await db.Query(sql, [param['login_name'], param['password'], param['nick_name'], 1, param['position_id']]);

            sql = "insert into admin(username,password,nick_name,register_time,last_login_time,`type`,cate,brand,`order`,recommend,navigation,waterfall)values(?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,?,?,?,?,?,?,?)";
            row = await db.Query(sql, [param['login_name'], param['password'], param['nick_name'], 1, JSON.stringify(param['cate']), JSON.stringify(param['brand']),param['order'],param['recommend'],param['navigation'],param['waterfall']]);
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

module.exports = shopAddAccount;