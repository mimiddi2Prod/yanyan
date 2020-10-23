var db = require("./../utils/dba");

function shopUpdateBestReview() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (param['review_id'] == 0) {
                // add
                sql = "insert into review(best_review_detail_id)values(?)";
                row = await db.Query(sql, param['id']);
                if (row.insertId) {
                    sql = "update item set review_id = ? where id = ?";
                    row = await db.Query(sql, [row.insertId, param['item_id']]);
                    if (row.changedRows == 1) {
                        data.text = '更改成功'

                        sql = "select image,name,review_id from item where id = ?"
                        row = await db.Query(sql, param['item_id'])
                        data.goodsInfo = row[0]
                        data.goodsInfo.item_id = param['item_id']
                        data.goodsInfo.image = JSON.parse(row[0].image)[0]
                    } else {
                        data.text = '更改失败'
                    }
                }
            } else if (param['review_id'] > 0) {
                // update
                sql = "update review set best_review_detail_id = ? where id = ?";
                row = await db.Query(sql, [param['id'], param['review_id']]);
                if (row.changedRows == 1) {
                    data.text = "更改成功"

                    sql = "select image,name,review_id from item where id = ?"
                    row = await db.Query(sql, param['item_id'])
                    data.goodsInfo = row[0]
                    data.goodsInfo.item_id = param['item_id']
                    data.goodsInfo.image = JSON.parse(row[0].image)[0]
                } else {
                    data.text = '更改失败'
                }
            }


            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopUpdateBestReview;