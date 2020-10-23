var db = require("./../utils/dba");
// const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopUpdateGoodsCategory() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            let update_goods_category_list = JSON.parse(param['goods_id_list'])
            if (update_goods_category_list.length <= 0) {
                console.info('没有可更改分类的商品')
            } else if (!param['category_id']) {
                console.info('没有获取要更改的分类')
            } else {
                let flag = 0
                for (let i in update_goods_category_list) {
                    sql = "update item set category_id_1 = ? where id = ?";
                    row = await db.Query(sql, [param['category_id'], update_goods_category_list[i]]);
                    if (row.changedRows == 1) {
                        flag++
                    }
                    if(flag == update_goods_category_list.length){
                        data.text = '编辑成功'
                    }
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopUpdateGoodsCategory;