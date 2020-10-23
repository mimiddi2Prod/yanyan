var db = require("./../utils/dba");

function shopAddGroupBuy() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            let end_time = new Date(param['end_time'])
            let start_time = new Date(param['start_time'])
            sql = "insert into group_buy(item_id,founded,create_time,start_time,end_time,user_id)values(?,?,current_timestamp,?,?,?)";
            row = await db.Query(sql, [param['id'], 0, start_time, end_time, param['user_id']]);
            console.info(row)
            if (row.insertId) {
                sql = "update item set group_id = ? where id = ?";
                row = await db.Query(sql, [row.insertId, param['id']]);
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

module.exports = shopAddGroupBuy;