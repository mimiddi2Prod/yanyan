var db = require("./../utils/dba");

function shopGetCard() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "select count(id) from card_info where status = 0";
            row = await db.Query(sql);
            data.number = row[0]['count(id)']

            sql = "select * from card_info where status = 0"
            row = await db.Query(sql)
            if (row.length > 0) {
                data.cardList = row
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetCard;
