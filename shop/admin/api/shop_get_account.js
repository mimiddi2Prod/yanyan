var db = require("./../utils/dba");

function shopGetAccount() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (param['position_id'] == 0) {
                // 获取全部
                sql = "select count(id) from admin where `type` != ?";
                row = await db.Query(sql, 0);
                data.number = row[0]['count(id)']

                sql = "select id,username,nick_name,position_id,type,cate,brand,`order`,recommend,navigation,waterfall from admin where `type` != ? ORDER BY register_time limit ?,?"
                row = await db.Query(sql, [0, param['last_id'] * 5, 5])
                data.accountList = row
            }
            // else {
            //     sql = "select count(id) from admin where `type` != ? and position_id = ?";
            //     row = await db.Query(sql, [0, param['position_id']]);
            //     data.number = row[0]['count(id)']
            //
            //     sql = "select id,username,nick_name,position_id,type from admin where `type` != ? and position_id = ? ORDER BY register_time limit ?,?"
            //     row = await db.Query(sql, [0, param['position_id'], param['last_id'] * 5, 5])
            //     data.accountList = row
            // }

            if (data.accountList.length > 0) {
                for (let i in data.accountList) {
                    if(data.accountList[i].position_id){
                        sql = "select id,`name`,goods_manage,order_manage,info_manage,user_manage,order_update_price,order_refund,order_other from `position` where id = ?"
                        row = await db.Query(sql, data.accountList[i].position_id)

                        data.accountList[i].position = row[0]
                    }
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetAccount;