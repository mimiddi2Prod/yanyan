// var db = require("./../utils/dba");
var wechatApi = require("./../utils/wechat_api")
var sha1 = require("js-sha1")

exports.getCard = async function (params) {
    return new Promise(async function (resolve, reject) {
        // 公众号自定义的卡券
        let data = await getCardByCardId(params)
        if (!data.err) {
            resolve({
                code: 0,
                data: data.result,
                msg: 'request success'
            })
        } else {
            reject({
                code: 1,
                msg: data.err
            })
        }
    })
};

async function getCardByCardId(params) {
    let data = {
        err: null,
        result: {}
    }
    await getCard(params).then(function (result) {
        data.result = result
    }).catch(function (err) {
        data.err = err
    })
    return data
}

async function getCard(params) {
    return new Promise(function (resolve, reject) {
        wechatApi.api.getCard(params['card_id'], function (err, result) {
            if (err) reject(err);
            resolve(result)
        })
    })
}

