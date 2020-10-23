var db = require("./../utils/dba");
function shopAddStore() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "insert into store(`name`,machine_code,location,phone,delivery_fee,free_delivery_fee,distance,start_time,end_time,create_time)values(?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)";
            row = await db.Query(sql, [param['name'],param["machine_code"],param['location'],param['phone'],param["delivery_fee"],param['free_delivery_fee'],param['distance'],param['start_time'],param['end_time']]);
            if (row.insertId) {
                data.code = 1
                data.text = '添加成功'
            } else {
                data.code = 0
                data.text = '添加失败'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopAddStore;