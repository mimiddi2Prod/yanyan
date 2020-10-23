var tools = require("./../tool");

function SHOPGetPanic() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetPanic::Run";
        var data = {};
        var response = tool.error.OK;
        var row = [];
        var sql = ''
        try {
            // 抢购
            sql = "select `name`,image,url,price,`describe`,id,panic_buying_id,panic_buying_time_id,`limit`,label from item where integral_price = ? and state = ? and panic_buying_id != ? ORDER BY sort"
            row = await query(sql, [0, 0, 0]);
            if (row.length == 0) {
                data.panicBuying = {}
                // log.warn('topic is not found')
            } else {
                for (var i in row) {
                    row[i].image = JSON.parse(row[i].image)
                    row[i].label = row[i].label ? JSON.parse(row[i].label) : ''
                }
                let panicBuying = row

                data.panicBuying = []
                // 抢购时间
                let current_day = new Date().getDay()
                current_day = current_day == 0 ? 7 : current_day
                sql = "select id,week,start_time,end_time from panic_buying_time ORDER BY start_time"
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
                // 筛选出周期内的商品 由于查询进行过排序 所以时间顺序没啥问题
                for (let i in tTime) {
                    data.panicBuying.push({
                        start_time: tTime[i].start_time,
                        end_time: tTime[i].end_time,
                        list: []
                    })
                    for (let j in panicBuying) {
                        if (panicBuying[j].panic_buying_time_id == tTime[i].id) {
                            data.panicBuying[i].list.push(panicBuying[j])
                        }
                    }
                }
                for (let i in data.panicBuying) {
                    for (let j in data.panicBuying[i].list) {
                        sql = "select panic_buying_price from panic_buying where id = ?"
                        row = await query(sql, data.panicBuying[i].list[j].panic_buying_id)
                        data.panicBuying[i].list[j].panic_buying_price = row[0].panic_buying_price
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
                action: "get_panic",
            }, res);
    }
}

module.exports = SHOPGetPanic;
