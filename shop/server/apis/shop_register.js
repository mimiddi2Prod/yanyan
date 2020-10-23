var tools = require("./../tool");

function SHOPRegister() {
    var tool = new tools;
    this.Run = async function (ver, param, res) {
        var data = {}
        var name = "FBRegister::Run";
        var response = tool.error.OK;
        if (!param["op_id"]) {
            response = tool.error.ErrorNotOpId;
        } else if (!param["nick_name"]) {
            response = tool.error.ErrorNotNickName;
        } else if (param["type"] == 0) { // type: 0 custom, 1 admin, 2 god
            var row = [];
            var sql = '';
            try {
                if (!param["avatar"]) {
                    log.warn('注册没有头像')
                } else {
                    sql = "update user set user_name = ?, avatar = ? where open_id = ?"
                    row = await tool.query(sql, [param["nick_name"], param["avatar"], param["op_id"]]);

                    sql = "select id from user where open_id = ?"
                    row = await tool.query(sql, param["op_id"]);
                    data.user_id = row[0].id
                }
            } catch (err) {
                response = tool.error.ErrorSQL;
                tool.log.error("FBRegister::Run", "code:", err.code, ", sql:", err.sql);
            }
        } else {
            response = tool.error.ErrorUserType;
            tool.log.warn(name, "error user type");
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "register",
            }, res);
    }
}

// function getUnionId(sessionKey, iv, encryptedData, appId) {
//     let pc = new WXBizDataCrypt(appId, sessionKey)
//     let data = pc.decryptData(encryptedData , iv)
//
//     console.log('解密后 data: ', data)
//     return data.openId
// }

module.exports = SHOPRegister;
