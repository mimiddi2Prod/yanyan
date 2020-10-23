var db = require("./../utils/dba");

function shopAddPanicBuyingTime() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "insert into panic_buying_time(week,start_time,end_time,create_time,user_id)values(?,?,?,CURRENT_TIMESTAMP,?)";
            row = await db.Query(sql, [param['week'], param['start_time'], param['end_time'], param['user_id']]);
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

module.exports = shopAddPanicBuyingTime;