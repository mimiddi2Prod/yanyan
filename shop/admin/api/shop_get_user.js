var db = require("./../utils/dba");

function shopGetUser() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (param['last_id'] >= 0) {
                sql = "select count(id) from `user`";
                row = await db.Query(sql, param['state']);
                data.number = row[0]['count(id)']

                sql = "select * from user order by register_time desc limit ?,?"
                row = await db.Query(sql, [param['last_id'] * 4, 4])
                if (row.length > 0) {
                    data.userList = row
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetUser;