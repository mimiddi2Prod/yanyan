var tools = require("./../tool");
var fs = require("fs")

function SHOPAddCard() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPAddCard::Run";
        var data = {};
        var response = tool.error.OK;
        fs.appendFile("log.log", new Date().toLocaleString() + '--后端数据param--  openid: ' + param["openid"] + " data: " + param["cardList"] + '\/n', function (err) {
        })
        if (!param["cardList"]) {
            tool.log.warn(name, 'cardList is not defined')
        } else if (!param["openid"]) {
            tool.log.warn(name, 'openid is not defind')
        } else {
            var row = [];
            try {
                let cardList = JSON.parse(param["cardList"]).cardList
                var sql = "select * from card_info where card_id in (?)"
                row = await tool.query(sql, [cardList.map(val => {
                    return val.cardId
                })])
                if (row.length > 0) {
                    let ctime = new Date(new Date().toLocaleDateString()).getTime()
                    for (let i in cardList) {
                        for (let j in row) {
                            if (row[j].card_id == cardList[i].cardId) {
                                let date_info = JSON.parse(row[j].cash).base_info.date_info
                                if (date_info.type == "DATE_TYPE_FIX_TIME_RANGE") {
                                    cardList[i].begin_time = new Date(date_info.begin_timestamp * 1000)
                                    cardList[i].end_time = new Date(date_info.end_timestamp * 1000)
                                } else if (date_info.type == "DATE_TYPE_FIX_TERM") {
                                    cardList[i].begin_time = new Date(ctime + (1000 * 60 * 60 * 24 * date_info.fixed_begin_term))
                                    cardList[i].end_time = new Date(ctime + (1000 * 60 * 60 * 24 * date_info.fixed_begin_term) + (1000 * 60 * 60 * 24 * date_info.fixed_term) - 1000)
                                }
                            }
                        }
                    }
                    fs.appendFile("log.log", new Date().toLocaleString() + '--后端数据data--  openid: ' + param["openid"] + " data: " + JSON.stringify(cardList) + '\/n', function (err) {
                    })

                    let list = cardList.map(val => {
                        return {
                            "card_id": val.cardId,
                            "code": val.code,
                            "cardExt": val.cardExt,
                            "openid": param["openid"],
                            "begin_time": val.begin_time,
                            "end_time": val.end_time,
                            "create_time": new Date(),
                        }
                    })
                    await BulkInsert('card', list)
                    data.text = "添加成功"
                }

                async function BulkInsert(table, list) {
                    let keys = Object.keys(list[0])
                    let sql = "insert into " + "`" + table + "` (`" + keys.join("`,`") + "`) values "
                    let string_1 = "(" + (() => {
                        let temp = []
                        keys.forEach(() => {
                            temp.push("?")
                        })
                        return temp
                    })() + ")"
                    let string_2 = (() => {
                        let temp = []
                        list.forEach(() => {
                            temp.push(string_1)
                        })
                        return temp
                    })()
                    sql += string_2
                    // 整理获得插入数据
                    let arr = []
                    list.forEach((value) => {
                        arr = arr.concat(Object.values(value))
                    })
                    tool.query(sql, arr)
                }
            } catch (err) {
                fs.appendFile("log.log", new Date().toLocaleString() + '--后端数据err-- openid: ' + param["openid"] + " err: " + JSON.stringify(err) + '\/n', function (err) {
                })
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPAddCard::Run", "code:", err.code, ", sql:", err.sql);
            }
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "add_card",
            }, res);
    }
}

module.exports = SHOPAddCard;
