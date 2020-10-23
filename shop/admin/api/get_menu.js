var db = require("./../utils/dba");

function getMenu() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (param['type'] == 0) {
                sql = "select id,`name`,image,tag from admin_menu where sup_id = ? and app = ?";
            } else if (param['type'] == 1) {
                sql = "select cate,`order`,recommend,navigation,waterfall from admin where id = ?"
                row = await db.Query(sql, param['user_id'])
                let list = []
                if (row.length > 0) {
                    // list = JSON.parse(row[0].brand).length > 0 ? list.concat("'商品'") : list
                    list = row[0].order == 1 ? list.concat("'订单'") : list
                    list = row[0].recommend == 1 ? list.concat("'推荐位管理'") : list
                    list = row[0].navigation == 1 ? list.concat("'导航管理'") : list
                    list = row[0].waterfall == 1 ? list.concat("'瀑布流管理'") : list
                }
                list = list.join(',')
                sql = "select id,`name`,image,tag from admin_menu where sup_id = ? and app = ? and `name` in(" + list + ")";

                // sql = "select id,`name`,image,tag from admin_menu where sup_id = ? and app = ? and `name` in('商品')";
            } else if (param['type'] == 2) {
                sql = "select id,`name`,image,tag from admin_menu where sup_id = ? and app = ? and `name` in('brunch')";
            }
            // sql = "select id,`name`,image,tag from admin_menu where sup_id = ? and app = ?";
            row = await db.Query(sql, [0, 'shop']);
            console.info(row)
            if (row.length > 0) {
                data.menu = row
                for (let i in data.menu) {
                    if (param['type'] == 0) {
                        sql = "select `name`,image,tag from admin_menu where sup_id = ? and app = ?";
                    } else if (param['type'] == 1) {
                        sql = "select `name`,image,tag from admin_menu where sup_id = ? and app = ? and `name` in('商品管理')";
                    } else if (param['type'] == 2) {
                        sql = "select `name`,image,tag from admin_menu where sup_id = ? and app = ?"
                    }
                    // sql = "select `name`,image,tag from admin_menu where sup_id = ? and app = ? and `name` in('商品管理')";
                    row = await db.Query(sql, [data.menu[i].id, 'shop']);
                    data.menu[i].subMenu = (row.length > 0 ? row : [])
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = getMenu;