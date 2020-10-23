var db = require("./../utils/dba");

function shopUpdateGoodsState() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var data = {}
        var row = []
        var sql = ""
        try {
            let goods_id_list = JSON.parse(param['goods_id_list'])
            if (goods_id_list.length <= 0) {
                console.info('没有获取要下架的商品id')
            } else {
                let flag = 0
                for (let i in goods_id_list) {
                    sql = "update item set state = ? where id = ?"
                    row = await db.Query(sql, [param["state"], goods_id_list[i]])
                    if (row.changedRows == 1) {
                        flag++
                    }
                    if (flag == goods_id_list.length) {
                        data = "更新商品状态成功"
                    }
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }

    }
}

module.exports = shopUpdateGoodsState;