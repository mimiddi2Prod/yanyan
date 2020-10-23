// var db = require("./../utils/dba");
var wechatApi = require("./../utils/wechat_api")
var sha1 = require("js-sha1")

exports.getCardExt = async function (params) {
    return new Promise(async function (resolve, reject) {
        /*接口请求生成的卡券
        let result = await getCardExtList(params)*/
        // 公众号自定义的卡券
        let data = await getCardExtBySelfBuilt(params)
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

// 3.签名
// 签名生成规则如下：
// 将所有参数的value值进行字符串的字典序排序；
// 将所有参数字符串拼接成一个字符串进行sha1加密，得到signature；
// 自定义code (勾选请确认创建接口中use_custom_code填写为true)；
// 指定用户领取 (勾选请确认创建接口中bind_openid填写为true)。
/*async function getCardExt(param) {
    return new Promise(function (resolve, reject) {
        wechatApi.api.getCardExt(param, function (err, result) {
            if (err) reject(err);
            resolve(result)
        })
    })
}

async function getCardExtList(params) {
    let param = {
        card_id: '',
        code: params["code"],
        openid: params["openid"],
        // balance: 100
    }
    let data = {
        err: null,
        result: []
    }
    for (let i in params["card_id"]) {
        param.card_id = params["card_id"][i]
        await getCardExt(param).then(function (result) {
            console.info(result)
            data.err = null
            data.result.push({
                cardId: param.card_id,
                cardExt: JSON.stringify(result)
            })
        }).catch(function (err) {
            data.err = err
        })
    }
    return data
}*/

// 公众号自定义的
async function getCardExtBySelfBuilt(params) {
    let data = {
        err: null,
        result: []
    }
    let api_ticket = ''
    await getTicket().then(function (e) {
        api_ticket = e.ticket
    })
    for (let i in params["card_id"]) {
        const openid = params["openid"]
        const card_id = params["card_id"][i]
        const nonceStr = getNonceStr()
        const timestamp = new Date().getTime().toString().slice(0, 10)
        const cardSign = await getSign(api_ticket, card_id, nonceStr, openid, timestamp)
        data.result.push({
            cardId: card_id,
            cardExt: JSON.stringify({
                code: '',
                openid: '',
                nonce_str: nonceStr,
                timestamp: timestamp,
                signature: cardSign
            })
        })
    }
    return data
}

async function getTicket() {
    return new Promise(function (resolve, reject) {
        wechatApi.api.getTicket('wx_card', function (err, result) {
            if (err) reject(err);
            resolve(result)
        })
    })
}

// 签名工具
async function getSign(api_ticket, card_id, nonceStr, openid, timestamp) {
    var oriArray = new Array();
    oriArray[0] = api_ticket;
    oriArray[1] = card_id;
    oriArray[2] = nonceStr;
    oriArray[3] = timestamp;
    oriArray.sort();
    let stringA = oriArray.join("")
    // console.info(stringA)
    var sign = sha1(stringA)
    return sign
}

// 随机字符串
function getNonceStr() {
    var text = ""
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < 16; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}