var db = require("./../utils/dba");
const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopUpdateGoodsPrice() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var data = {}
        var row = []
        var sql = ""
        try {
            let flag1 = 0, success1 = false, flag2 = 0, success2 = false
            for (let i in param['goods_list']) {
                sql = "update item set price = ? where id = ?"
                row = await db.Query(sql, [param["goods_list"][i].price, param["goods_list"][i].id])
                if (row.changedRows == 1) {
                    flag1++
                }

                // for (let j in param['goods_list'][i].param) {
                //     sql = "update item_price set price = ? where id = ?"
                //     row = await db.Query(sql, [param['goods_list'][i].param[j].price_latest, param['goods_list'][i].param[j].id])
                //
                //     if (row.changedRows == 1) {
                //         flag2++
                //     }
                //     if (flag2 == param['goods_list'][i].param.length) {
                //         success2 = true
                //     }
                // }

                if (flag1 == param['goods_list'].length) {
                    success1 = true
                }
            }

            // if (success1 && success2) {
            if (success1) {
                data.text = "编辑成功"
            } else {
                data.text = "编辑失败"
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }

    }
}

module.exports = shopUpdateGoodsPrice;