var tools = require("./../tool");

function SHOPGetPrice() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetPrice::Run";
        var data = {};
        var response = tool.error.OK;
        var row = [];
        try {
            var sql = 'select param_id_1,param_id_2,stock,price,item_id,id from item_price where item_id = ?'
            row = await query(sql, param['id']);
            if (row.length == 0) {
                log.warn('specification is not found')
            } else {
                data = row
                var currentTime = new Date()
                var oneHourBefore = new Date(currentTime - (60 * 60 * 1000))
                sql = 'select sum(number),item_price_id from paid where create_time >= ? and state = ? GROUP BY item_price_id'
                row = await query(sql, [oneHourBefore, 0])
                for (var i in row) {
                    for (var j in data) {
                        if (row[i].item_price_id == data[j].id) {
                            data[j].stock = data[j].stock - row[i]['sum(number)']
                        }
                    }
                }
            }
        } catch (err) {
            if (err.code) {
                response = tool.error.ErrorSQL;
                log.warn(name, "code:", err.code, ", sql:", err.sql);
            } else {
                log.warn(name, JSON.stringify(response));
                response = tool.error.ErrorCatch;
            }
        }

        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "get_price",
            }, res);
    }
}

module.exports = SHOPGetPrice;
