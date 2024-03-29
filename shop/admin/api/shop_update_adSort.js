var db = require("./../utils/dba");

// const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopUpdateAdSort() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = 'update advertisement set sort = ? where id = ?'
            row = await db.Query(sql, [param['sort'], param['id']])
            if (row.changedRows == 1) {
                data.code = 0
                data.text = '编辑成功'
            } else {
                data.code = 1
                data.text = '编辑失败'
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopUpdateAdSort;