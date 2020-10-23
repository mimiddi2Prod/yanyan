var tools = require("./../tool");

function SHOPBeShare() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var name = "SHOPBeShare::Run";
        var data = {};
        var response = tool.error.OK;
        try {
            // share_id : 分享人id（红包领取者），be_share_id: 被分享者（工具人）
            let sql = "select * from `user` where id = ? and register_time = last_login_time",
                row = await tool.query(sql, [param["be_share_id"]]),
                row2 = await tool.query("select * from share_record where be_share_id = ?", param["be_share_id"])
            if (row.length && !row2.length) {
                // 是新用户
                sql = "insert into share_record (share_id,be_share_id,create_time)value(?,?,current_timestamp)"
                row = await tool.query(sql, [param["share_id"], param["be_share_id"]])
            }

        } catch (e) {
            console.info(e)
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "be_share",
            }, res);
    }
}

module.exports = SHOPBeShare;
