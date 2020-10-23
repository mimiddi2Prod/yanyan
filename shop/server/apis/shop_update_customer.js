var tools = require("./../tool");
var yinbaoAppId = require('./../config/yinbaoConfig').appId
var request = require('../utils/yinbaoRequest')

// 银豹用户密码加密方式
// const crypto = require('crypto')
// const hash = crypto.createHash('md5');
// let t = '123'
// var md5 = hash.update(t).digest('hex');
// console.info(md5)

function SHOPUpdateCustomer() {
    var tool = new tools;
    var log = tool.log;

    this.Run = async function (ver, param, res) {
        var name = "SHOPUpdateCustomer::Run";
        var data = {};
        var response = tool.error.OK;
        if (param['customerUid'].length <= 0) {
            console.info('没有收到customerUid')
        } else if (param['balanceIncrement'].length <= 0) {
            console.info('没有收到balanceIncrement')
        } else if (param['pointIncrement'].length <= 0) {
            console.info('没有收到pointIncrement')
        } else {
            try {
                // 更新会员信息
                let updateCustomer = require('./yinbao_update_customer')
                let callData = await updateCustomer(param)
                if (callData.code == 0) {
                    data = callData
                }
            } catch (err) {
                if (err.code) {
                    response = tool.error.ErrorSQL;
                    log.warn(name, "code:", err.code, ", sql:", err.sql);
                } else {
                    log.warn(name, JSON.stringify(response));
                    response = tool.error.ErrorCatch;
                }
            }
        }
        tool.MakeResponse(200,
            {
                res: response,
                data: data,
                action: "update_customer",
            }, res);
    }
}

module.exports = SHOPUpdateCustomer;
