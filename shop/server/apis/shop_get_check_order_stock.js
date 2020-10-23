var tools = require("./../tool");

function SHOPGetCheckOrderStock() {
    var tool = new tools;
    var log = tool.log;
    var query = tool.query;

    this.Run = async function (ver, param, res) {
        var name = "SHOPGetCheckOrderStock::Run";
        var data = {};
        var response = tool.error.OK;
        var row = [], sql = '';
        try {
            if (!param.user_id && param.order.length <= 0) {
                data.code = 1
            } else {
                let itemParamList = []
                let notItemParamList = []
                for (let i in param.order) {
                    // 确认商品对应属性都存在于数据库中
                    sql = 'select * from item where id = ?'
                    row = await query(sql, [param.order[i]['item_id']]);
                    if (row.length > 0 && row[0].state == 0) {
                        itemParamList = itemParamList.concat(row)
                    } else {
                        notItemParamList.push(param.order[i])
                    }
                }
                if (itemParamList.length == param.order.length) {
                    let haveStock = itemParamList.every(function (eData) {
                        for (let i in param.order) {
                            if (eData.id == param.order[i].item_id) {
                                if (eData.stock >= param.order[i].number) {
                                    return true
                                }
                            }
                        }
                        return false
                    })

                    data.code = 0
                    if (haveStock) {
                        data.canPay = 0
                        data.text = '库存有盈余'
                    } else {
                        // 提取库存不足的商品名字
                        let shortageList = []
                        for (let i in itemParamList) {
                            for (let j in param.order) {
                                if (itemParamList[i].id == param.order[j].item_id) {
                                    if (itemParamList[i].stock < param.order[j].number) {
                                        param.order[j].stock = itemParamList[i].stock
                                        shortageList.push(param.order[j])
                                    }
                                }
                            }
                        }

                        data.canPay = 1
                        data.text = '库存耗竭'
                        data.shortageList = shortageList
                    }
                } else {
                    // 有商品在后台被编辑 找不到对应参数价格
                    data.code = 0
                    data.canPay = 1
                    data.text = "找不到商品型号"
                    data.shortageList = notItemParamList.map(function (eData) {
                        eData.stock = 0
                        return eData
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
                action: "check_stock",
            }, res);
    }
}

module.exports = SHOPGetCheckOrderStock;
