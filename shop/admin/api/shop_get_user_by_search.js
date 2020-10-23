var db = require("./../utils/dba");

function shopGetUserBySearch() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "select * from `user` where id = ?"
            // let arr = []
            // if (param['searchString']) {
            //     sql += ' name = ?'
            //     arr.push(param['searchString'])
            // }
            // sql += ' and state != ?'
            // arr.push("2")

            // console.info(sql)
            // console.info(arr)
            row = await db.Query(sql, param['searchString']);

            data.userList = row


            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetUserBySearch;