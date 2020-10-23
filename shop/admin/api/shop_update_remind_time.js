var db = require("./../utils/dba");
// const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopUpdateRemindTime() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            sql = "update remind_time set remind_time = CURRENT_TIMESTAMP where tag = ?";
            row = await db.Query(sql,'order');
            if (row.changedRows == 1) {
                data.code = 1
            } else {
                data.code = 0
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopUpdateRemindTime;