var db = require("./../utils/dba");

function shopGetOrderAmount() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            // 本系统订单价格
            // sql = "select sum(total_price) from `order` where state >= ?";
            // row = await db.Query(sql, 1);
            // let total_price = row[0]['sum(total_price)']
            //
            // data.number = Number(total_price).toFixed(2)

            // 银豹订单价格
            sql = "select sum(total_price) from `yinbao_order_sellprice`";
            row = await db.Query(sql);
            let total_price = row[0]['sum(total_price)']

            data.number = Number(total_price).toFixed(2)

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetOrderAmount;