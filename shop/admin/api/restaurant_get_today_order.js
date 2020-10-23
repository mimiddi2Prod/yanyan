var db = require("./../utils/dba");

function restaurantGetTodayOrder() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "select sum(total_price) from yinbao_order_sellprice_today"
            row = await db.Query(sql)
            data.sellprice = 0
            if(row.length > 0){
                data.sellprice = row[0]['sum(total_price)']
            }

            sql = "select * from yinbao_order_today"
            row = await db.Query(sql)
            data.list = row

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = restaurantGetTodayOrder;