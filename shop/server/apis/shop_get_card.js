var tools = require("./../tool");

function SHOPGetCard() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPGetCard::Run";
        var data = [];
        var response = tool.error.OK;
        if (!param["openid"]) {
            tool.log.warn(name, 'user_id is not defined')
        } else {
            var row = [];
            var sql = ""
            try {
                sql = "select select_card_id from `order` where select_card_id is not null and state != -1 group by select_card_id"
                row = await tool.query(sql)
                let abCard = row

                sql = "select * from card where openid = ? and trade_id is null"
                row = await tool.query(sql, param["openid"])
                let myCard = row
                if (myCard.length > 0) {
                    let myCardIdList = myCard.map(function (fn) {
                        return fn.card_id
                    })
                    let ctime = new Date()
                    sql = "select * from card_info where card_id in (?)"
                    row = await tool.query(sql, [myCardIdList.map(function (e) {
                        return e
                    })])
                    row = row.filter(function (e) {
                        let date_info = JSON.parse(e.cash).base_info.date_info
                        if (date_info.type == "DATE_TYPE_FIX_TIME_RANGE") {
                            return (new Date(date_info.begin_timestamp * 1000).getTime() < ctime && new Date(date_info.end_timestamp * 1000).getTime() > ctime)
                        } else {
                            return true
                        }
                    })
                    for (let i in row) {
                        let cash = JSON.parse(row[i].cash)
                        let base_info = cash.base_info
                        for (let j in myCard) {
                            if (myCard[j].card_id == base_info.id) {
                                myCard[j].least_cost = cash.least_cost / 100
                                myCard[j].reduce_cost = cash.reduce_cost / 100
                                myCard[j].cash = cash
                            }
                        }
                    }
                    data = myCard
                    data = data.filter(function (item) {
                        for (let i in abCard) {
                            if (item.id == abCard[i].select_card_id) {
                                return false
                            }
                        }
                        return true
                    })
                }

            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPGetCard::Run", "code:", err.code, ", sql:", err.sql);
            }
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "get_card",
            }, res);
    }
}

module.exports = SHOPGetCard;
