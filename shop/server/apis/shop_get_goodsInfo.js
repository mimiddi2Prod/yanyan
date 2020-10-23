var tools = require("./../tool");

function SHOPGetGoodsInfo() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetGoodsInfo::Run";
        var data = {};
        var response = tool.error.OK;
        var row = [];
        try {
            var sql = 'select name,image,url,price,stock,`describe`,review_id,goods_info,id,integral_price,panic_buying_id,panic_buying_time_id,`limit`,label from item where id = ?'
            row = await query(sql, param['itemId']);
            for (let i in row) {
                row[i].image = JSON.parse(row[i].image)
                row[i].label = row[i].label ? JSON.parse(row[i].label) : null
                row[i].goods_info = JSON.parse(row[i].goods_info)
            }
            if (row.length == 0) {
                log.warn('goodsInfo is not found')
            } else {
                var rowData = row[0]
                if (rowData.panic_buying_id != 0) {
                    sql = "select panic_buying_price from panic_buying where id = ?"
                    row = await tool.query(sql, rowData.panic_buying_id)
                    rowData.panic_buying_price = row[0].panic_buying_price.toFixed(2)

                    sql = "select week,start_time,end_time from panic_buying_time where id = ?"
                    row = await tool.query(sql, rowData.panic_buying_time_id)
                    rowData.week = row[0].week
                    rowData.start_time = row[0].start_time
                    rowData.end_time = row[0].end_time
                }

                sql = 'select count(id),sum(`number`) from `order` where item_id = ?'
                row = await query(sql, rowData.id)
                if (row[0]['sum(`number`)'] == null) {
                    rowData.volume = 0
                } else {
                    rowData.volume = row[0]['sum(`number`)']
                }
                data = rowData
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
                action: "get_goodsInfo",
            }, res);
    }
}

module.exports = SHOPGetGoodsInfo;
