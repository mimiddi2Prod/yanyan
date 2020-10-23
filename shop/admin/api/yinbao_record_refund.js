var db = require("./../utils/dba");

function yinbaoRecordRefund() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            let time = new Date(param['time'])
            sql = "select id from yinbao_refund where `time` = ?"
            row = await db.Query(sql, time)
            if (row.length > 0) {
                let id = row[0].id
                sql = "update yinbao_refund set total_refund = ? where id = ?";
                row = await db.Query(sql, [param['refund'], id]);

                if (row.changedRows == 1) {
                    data.code = 0
                    data.text = '编辑成功'
                } else {
                    data.code = 1
                    data.text = '编辑失败'
                }
            } else {
                sql = "insert into yinbao_refund(total_refund,`time`)values(?,?)"
                row = await db.Query(sql, [param['refund'], time])

                if (row.insertId) {
                    data.code = 0
                    data.text = '编辑成功'
                } else {
                    data.code = 1
                    data.text = '编辑失败'
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = yinbaoRecordRefund;