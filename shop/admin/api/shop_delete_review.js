var db = require("./../utils/dba");

function shopDelReview() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "select id from review where best_review_detail_id = ?";
            row = await db.Query(sql, param['del_review_id']);
            if(row.length > 0 && row[0].id == param['best_review_id']){
                // 删除 review表的数据和review_detail表的数据 更新 item表中的review_id为0
                sql = "delete from review where best_review_detail_id = ?";
                row = await db.Query(sql, param['del_review_id']);

                sql = "update item set review_id = ? where id = ?";
                row = await db.Query(sql, [0, param['item_id']]);

                sql = "delete from review_detail where id = ?";
                row = await db.Query(sql, param['del_review_id']);

                if (row.affectedRows == 1) {
                    data.text = '删除成功'
                } else {
                    data.text = '删除失败'
                }
            }else{
                // 直接删除review_detail表的数据
                sql = "delete from review_detail where id = ?";
                row = await db.Query(sql, param['del_review_id']);
                if (row.affectedRows == 1) {
                    data.text = '删除成功'
                } else {
                    data.text = '删除失败'
                }
            }

            // if (param['best_review_id'] != param['del_review_id']) {
            //
            // } else {
            //
            // }

            sql = "select image,name,review_id from item where id = ?"
            row = await db.Query(sql, param['item_id'])
            console.info(row)
            data.goodsInfo = row[0]
            data.goodsInfo.item_id = param['item_id']
            data.goodsInfo.image = JSON.parse(row[0].image)[0]

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopDelReview;