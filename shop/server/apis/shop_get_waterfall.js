var tools = require("./../tool");

function SHOPGetWaterfall() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetWaterfall::Run";
        var data = {};
        var response = tool.error.OK;
        var row = [];
        var sql = ''
        try {
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
            // 所有抢购价
            sql = "select panic_buying_price,id from panic_buying"
            row = await query(sql)
            let panicBuyingList = row

            // param['type'] 0 首页瀑布流 1 积分商城 2 团购
            if (param['type'] != 2) {
                if (param['type'] == 0) {
                    sql = "select `name`,image,url,price,`describe`,id,panic_buying_id,panic_buying_time_id,`limit`,label,stock from item where integral_price = ? and `type` = ? and state = ? ORDER BY sort limit ?,?"
                    row = await query(sql, [0, 0, 0, param['item_last_id'] * 8, 8]);
                } else if (param['type'] == 1) {
                    sql = "select `name`,image,url,price,`describe`,id,integral_price,`limit`,label,stock from item where integral_price > ? and state = ? ORDER BY sort limit ?,?"
                    row = await query(sql, [0, 0, param['item_last_id'] * 8, 8]);
                }

                if (row.length == 0) {
                    data.waterfallList = []
                } else {
                    for (var i in row) {
                        row[i].image = JSON.parse(row[i].image)
                        row[i].label = row[i].label ? JSON.parse(row[i].label) : ''
                    }
                    data.waterfallList = row
                    if (param['type'] == 0) {
                        data.waterfallList = data.waterfallList.map(function (item) {
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

                if (param['type'] == 0) {
                    sql = "select `name`,image,url,price,`describe`,id,panic_buying_id,panic_buying_time_id,`limit`,label,stock from item where integral_price = ? and `type` = ? and state = ? ORDER BY sort limit ?,?"
                    row = await query(sql, [0, 1, 0, param['topic_last_id'], 1]);
                    if (row.length == 0) {
                        data.topic = []
                    } else {
                        for (var i in row) {
                            row[i].image = JSON.parse(row[i].image)
                            row[i].label = row[i].label ? JSON.parse(row[i].label) : ''
                        }
                        data.topic = row
                        data.topic = data.topic.map(function (item) {
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

                    // 抢购
                    sql = "select `name`,image,url,price,`describe`,id,panic_buying_id,panic_buying_time_id,`limit`,label,stock from item where integral_price = ? and `type` = ? and state = ? and panic_buying_id != ? ORDER BY sort"
                    row = await query(sql, [0, 3, 0, 0]);
                    if (row.length == 0) {
                        data.panicBuying = {}
                    } else {
                        for (var i in row) {
                            row[i].image = JSON.parse(row[i].image)
                            row[i].label = row[i].label ? JSON.parse(row[i].label) : ''
                        }
                        let panicBuying = row

                        data.panicBuying = []
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
                action: "get_waterfall",
            }, res);
    }
}

module.exports = SHOPGetWaterfall;
