var db = require("./../utils/dba");
// const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopDeleteCategory() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            // 如果大分类删除 需要对小分类进行处理 （没有父分类的小分类或许应  归并到其他分类中，若是小分类改为大分类，则商品也找不到 ）
            // 如果小分类删除 还需要对商品做些处理（商品保留 不影响瀑布流等其他方面的展示，但是不能从分类中找到）
            // if(param['parent_id'] == 0){
            //     sql = "update category set where parent_id = ?"
            //     row = await query(sql, param['id']);
            // }
            sql = "delete from category where id = ?";
            row = await db.Query(sql, param['id']);
            console.info(row)
            if (row.affectedRows == 1) {
                data.text = '删除成功'
            } else {
                data.text = '删除失败'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
        //    connection.query('SELECT * FROM `order`',function (err, result) {
        //     if(err){
        //       console.log('[SELECT ERROR] - ',err.message);
        //       return;
        //     } else if(!result.length){
        //       console.info('查询失败')
        //       return callback(1);
        //     }
        //
        //    console.log('查询成功');
        //  console.info(result)
        //    return callback(result);
        // });
    }
}

module.exports = shopDeleteCategory;