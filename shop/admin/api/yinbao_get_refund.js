var db = require("./../utils/dba");

function yinbaoGetRefund() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            let start_time = new Date(param['start_time'])
            let end_time = new Date(param['end_time'])
            sql = "select * from yinbao_refund where `time` >= ? and `time` <= ?"
            row = await db.Query(sql, [start_time, end_time])

            data = row
            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = yinbaoGetRefund;