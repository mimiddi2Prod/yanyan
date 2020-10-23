var tools = require("./../tool");

function SHOPGetGoodsList() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetCategoryInfo::Run";
        var data = {};
        var response = tool.error.OK;
        var row = [];
        try {
            let current_day = new Date().getDay()
            current_day = current_day == 0 ? 7 : current_day
            var sql = "select id,week,start_time,end_time from panic_buying_time ORDER BY start_time"
            row = await query(sql)
            let pbtime = row
            let tTime = []
            // 排除不在周期内的
            for (let i in pbtime) {
                let weekTime = new RegExp(pbtime[i].week)
                if (weekTime.test(current_day)) {
                    tTime.push(pbtime[i])
                }
            }

            // 所有抢购价
            sql = "select panic_buying_price,id from panic_buying"
            row = await query(sql)
            let panicBuyingList = row
            // 以上 抢购价
            if (param['categoryId']) {
                sql = 'select name,image,url,price,`describe`,id,`limit`,label,stock from item where integral_price = ? and state = ? and category_id_1 = ? ORDER BY sort limit ?,?'
                row = await query(sql, [0, 0, param['categoryId'], param['last_id'] * 8, 8]);
            } else {
                sql = 'select name,image,url,price,`describe`,id,stock,panic_buying_id,panic_buying_time_id,`limit`,label,stock from item where integral_price = ? and state = ? ORDER BY sort'
                row = await query(sql, [0, 0]);
            }

            if (row.length > 0) {
                for (let i in row) {
                    row[i].image = JSON.parse(row[i].image)
                    row[i].label = row[i].label ? JSON.parse(row[i].label) : ''
                }
            } else {
                data = []
            }

            if (row.length == 0) {
                log.warn('categoryInfo is not found')
            } else {
                data = row
                if (!param['categoryId']) {
                    data = data.map(function (item) {
                        for (let i in tTime) {
                            if (item.panic_buying_time_id == tTime[i].id) {
                                item.start_time = tTime[i].start_time
                                item.end_time = tTime[i].end_time
                            }
                        }
                        for (let i in panicBuyingList) {
                            if (item.panic_buying_id == panicBuyingList[i].id) {
                                item.panic_buying_price = panicBuyingList[i].panic_buying_price
                            }
                        }
                        return item
                    })
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
                action: "get_goodsList",
            }, res);
    }
}

module.exports = SHOPGetGoodsList;
