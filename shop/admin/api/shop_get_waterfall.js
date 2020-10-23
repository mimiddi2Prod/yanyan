var db = require("./../utils/dba");

function shopGetWaterfall() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (param['last_id'].toString().length <= 0) {
                // 分页
                console.info('last_id未获取')
            } else if (param['type'].toString().length <= 0) {
                // type 0瀑布流 1专题精选 2不在首页展示
                console.info('type未获取')
            } else {
                sql = "select count(id) from item where `type` = ? and state = ?";
                row = await db.Query(sql, [param['type'], 0]);
                data.number = row[0]['count(id)']

                sql = "select id,name,image,`type`,sort,create_time,`describe` from item where `type` = ? and state = ? ORDER BY sort limit ?,?"
                row = await db.Query(sql, [param['type'], 0, param['last_id'] * 5, 5])
                if (row.length > 0) {
                    for (let i in row) {
                        if (row[i].image.length > 0) {
                            row[i].image = JSON.parse(row[i].image)[0]
                        }
                    }
                    data.list = row
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetWaterfall;