var db = require("./../utils/dba");

function shopGetAfterSaleNumber() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "select count(id) from `order` where after_sale_state >= ? && after_sale_state <= ?";
            row = await db.Query(sql, [1, 3]);
            data.number = row[0]['count(id)']

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetAfterSaleNumber;