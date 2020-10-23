var tools = require("./../tool");

function SHOPGetCart() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPGetCart::Run";
        var data = [];
        var response = tool.error.OK;
        if (!param["user_id"]) {
            tool.log.warn(name, 'user_id is not defined')
        } else if (param["user_id"]) {
            var row = [];
            var sql = ""
            try {
                sql = "select item_id,`number`,id from cart where user_id = ?"
                row = await tool.query(sql, param["user_id"])
                var rowData = row
                if (rowData.length > 0) {
                    // for (let i in rowData) {
                    //     // 需要做 获取库存时 需要再减去 获取paid一个小时内下单但未付款的数量
                    //     sql = "select price,stock,name,url,`describe`,id,integral_price,image,panic_buying_id,panic_buying_time_id,`limit`,state from item where id = ?"
                    //     row = await tool.query(sql, [rowData[i].item_id])
                    //     if (row.length > 0) {
                    //         rowData[i].price = row[0].price.toFixed(2)
                    //         rowData[i].stock = row[0].stock
                    //         rowData[i].item_id = row[0].id
                    //         rowData[i].name = row[0].name
                    //         rowData[i].url = row[0].url
                    //         rowData[i].describe = row[0].describe
                    //         rowData[i].integral_price = row[0].integral_price
                    //         rowData[i].image = JSON.parse(row[0].image)[0]
                    //         rowData[i].panic_buying_id = row[0].panic_buying_id
                    //         rowData[i].panic_buying_time_id = row[0].panic_buying_time_id
                    //         rowData[i].limit = row[0].limit
                    //         rowData[i].state = row[0].state
                    //
                    //         if (row[0].limit < rowData[i].number) {
                    //             rowData[i].number = row[0].limit
                    //         }
                    //     }
                    // }
                    sql = "select price,stock,name,url,`describe`,id,integral_price,image,panic_buying_id,panic_buying_time_id,`limit`,state from item where id in (?)"
                    row = await tool.query(sql, [rowData.map(val => {
                        return val.item_id
                    })])
                    if (row.length) {
                        rowData = rowData.map(val => {
                            row.forEach(m => {
                                if (val.item_id == m.id) {
                                    val.price = m.price.toFixed(2)
                                    val.stock = m.stock
                                    val.item_id = m.id
                                    val.name = m.name
                                    val.url = m.url
                                    val.describe = m.describe
                                    val.integral_price = m.integral_price
                                    val.image = JSON.parse(m.image)[0]
                                    val.panic_buying_id = m.panic_buying_id
                                    val.panic_buying_time_id = m.panic_buying_time_id
                                    val.limit = m.limit
                                    val.state = m.state

                                    if (m.limit < val.number) {
                                        val.number = m.limit
                                    }
                                }
                            })
                            return val
                        })
                    }
                }
                if (param.ver == '2.0') {
                    // 把服务器的时间给予前端，避免用户改手机本地时间问题
                    data = {
                        time: new Date(),
                        order: []
                    }
                    if (rowData.length > 0) {
                        data.order = rowData.filter(function (res) {
                            // 先去除掉没有数据的
                            return res.item_id
                        }).filter(function (res) {
                            return res.price.toString()
                        }).filter(function (res) {
                            return res.state == 0
                        })

                        for (let i in data.order) {
                            if (data.order[i].panic_buying_id != 0) {
                                sql = "select panic_buying_price from panic_buying where id = ?"
                                row = await tool.query(sql, data.order[i].panic_buying_id)
                                if (row.length > 0) {
                                    data.order[i].panic_buying_price = row[0].panic_buying_price.toFixed(2)
                                }

                                sql = "select week,start_time,end_time from panic_buying_time where id = ?"
                                row = await tool.query(sql, data.order[i].panic_buying_time_id)
                                if (row.length > 0) {
                                    data.order[i].week = row[0].week
                                    data.order[i].start_time = row[0].start_time
                                    data.order[i].end_time = row[0].end_time
                                }
                            }
                        }
                    }
                } else {
                    if (rowData.length > 0) {
                        data = rowData.filter(function (res) {
                            // 先去除掉没有数据的
                            return res.item_id
                        }).filter(function (res) {
                            return res.price.toString()
                        }).filter(function (res) {
                            return res.state == 0
                        })

                        for (let i in data) {
                            if (data[i].panic_buying_id != 0) {
                                sql = "select panic_buying_price from panic_buying where id = ?"
                                row = await tool.query(sql, data[i].panic_buying_id)
                                if (row.length > 0) {
                                    data[i].panic_buying_price = row[0].panic_buying_price.toFixed(2)
                                }

                                sql = "select week,start_time,end_time from panic_buying_time where id = ?"
                                row = await tool.query(sql, data[i].panic_buying_time_id)
                                if (row.length > 0) {
                                    data[i].week = row[0].week
                                    data[i].start_time = row[0].start_time
                                    data[i].end_time = row[0].end_time
                                }
                            }
                        }
                    }
                }

            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("SHOPGetCart::Run", err);
            }
        } else {
            tool.log.warn(name, "goods param is not defined");
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "get_cart",
            }, res);
    }
}

module.exports = SHOPGetCart;
