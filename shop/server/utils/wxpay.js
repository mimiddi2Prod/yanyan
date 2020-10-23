// const md5 = require('md5-node')	//引入md5加密模块
// const xml2js = require('xml2js');	//引入xml解析模块
// const https = require('https');

const axios = require('axios')
const md5 = require('blueimp-md5')
const xml2js = require('xml2js')
const xmlParser = new xml2js.Parser()
// 一个方便的 log 方法
const log = console.log.bind(console)

const wxConfig = require('./../config/wxConfig')
var mch_id = wxConfig.mch_id//商户号
var PAY_API_KEY = wxConfig.PAY_API_KEY
var appid = wxConfig.appid

// 微信小程序支付入口
async function payfee(data = {}) {
    return new Promise(function (resolve, reject) {
        // console.info('开始获取支付信息')
        // console.info(data)

        // attach 是一个任意的字符串, 会原样返回, 可以用作一个标记
        const attach = 'nw'
        // 一个随机字符串
        const nonceStr = getNonceStr()
        // 用户的 openId
        const openId = data.openid
        // 小程序的 appId
        const appId = appid
        // 微信商户号
        const mchId = mch_id
        // 金额
        const price = data.total_fee
        // 商品简单描述 如：腾讯充值中心-QQ会员充值
        const productIntro = data.body
        //通知地址  确保外网能正常访问
        const notifyUrl = 'https://yanyan.youyueworld.com/apis/shop_wxPay_notify'
        // 生成商家内部自定义的订单号, 商家内部的系统用的, 理论上只要不和其他订单重复, 使用任意的字符串都是可以的
        const tradeId = getTradeId(attach)
        // 生成签名
        // 这里是在 express 获取用户的 ip, 因为使用了 nginx 的反向代理, 所以这样获取
        // let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        // ip = ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
        let ip = '120.79.94.138' //终端IP
        // let ip = '127.0.0.1:9001'
        const sign = getPrePaySign(appId, attach, productIntro, mchId, nonceStr, notifyUrl, openId, tradeId, ip, price)
        // 将微信需要的数据拼成 xml 发送出去
        const sendData = wxSendData(appId, attach, productIntro, mchId, nonceStr, notifyUrl, openId, tradeId, ip, price, sign)

        // https://api.mch.weixin.qq.com/pay/unifiedorder
        // var options = {
        //     host: 'api.mch.weixin.qq.com',
        //     path: 'pay/unifiedorder' + appid,
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // };
        // async function Call() {
        //     var e = await HttpsGet(options)
        //     data = JSON.parse(e)
        // }
        // Call()
        // 使用 axios 发送数据带微信支付服务器, 没错, 后端也可以使用 axios
        axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder', sendData).then(wxResponse => {
            // 微信返回的数据也是 xml, 使用 xmlParser 将它转换成 js 的对象
            xmlParser.parseString(wxResponse.data, (err, success) => {
                if (err) {
                    log('parser xml error ', err)
                } else {
                    // console.info(success)
                    if (success.xml.return_code[0] === 'SUCCESS') {
                        const prepayId = success.xml.prepay_id[0]
                        const payParamsObj = getPayParams(prepayId, tradeId)
                        // 返回给前端, 这里是 express 的写法
                        // res.json(payParamsObj)
                        resolve(payParamsObj)
                    } else {
                        // 错误处理
                        if (err) {
                            log('axios post error', err)
                            reject(502)
                            // res.sendStatus(502)
                        } else if (success.xml.return_code[0] !== 'SUCCESS') {
                            // res.sendStatus(403)
                            reject(403)
                        }
                    }
                }
            })
        }).catch(err => {
            log('post wx err', err)
        })

    })
}

module.exports = payfee

// async function HttpsGet(option) {
//     return new Promise(function (resolve, reject) {
//         https.get(option, function (res) {
//             let data = ''
//             res.on('data', function (chunk) {
//                 data += chunk;
//             })
//             res.on('end', function (e) {
//                 resolve(data)
//             })
//         })
//     })
// }

// 预定义的一些工具函数
function getNonceStr() {
    var text = ""
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < 16; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function getPaySign(appId, timeStamp, nonceStr, package) {
    var stringA = 'appId=' + appId +
        '&nonceStr=' + nonceStr +
        '&package=' + package +
        '&signType=MD5' +
        '&timeStamp=' + timeStamp

    var stringSignTemp = stringA + '&key=' + PAY_API_KEY
    var sign = md5(stringSignTemp).toUpperCase()
    return sign
}

function getTradeId(attach) {
    var date = new Date().getTime().toString()
    var text = ""
    var possible = "0123456789"
    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    var tradeId = attach + '_' + date + text
    // console.info(tradeId)
    return tradeId
}

function getPrePaySign(appId, attach, productIntro, mchId, nonceStr, notifyUrl, openId, tradeId, ip, price) {
    var stringA = 'appid=' + appId +
        '&attach=' + attach +
        '&body=' + productIntro +
        '&mch_id=' + mchId +
        '&nonce_str=' + nonceStr +
        '&notify_url=' + notifyUrl +
        '&openid=' + openId +
        '&out_trade_no=' + tradeId +
        '&spbill_create_ip=' + ip +
        '&total_fee=' + price +
        '&trade_type=JSAPI'
    var stringSignTemp = stringA + '&key=' + PAY_API_KEY
    var sign = md5(stringSignTemp).toUpperCase()
    return sign
}

function wxSendData(appId, attach, productIntro, mchId, nonceStr, notifyUrl, openId, tradeId, ip, price, sign) {
    const sendData = '<xml>' +
        '<appid>' + appId + '</appid>' +
        '<attach>' + attach + '</attach>' +
        '<body>' + productIntro + '</body>' +
        '<mch_id>' + mchId + '</mch_id>' +
        '<nonce_str>' + nonceStr + '</nonce_str>' +
        '<notify_url>' + notifyUrl + '</notify_url>' +
        '<openid>' + openId + '</openid>' +
        '<out_trade_no>' + tradeId + '</out_trade_no>' +
        '<spbill_create_ip>' + ip + '</spbill_create_ip>' +
        '<total_fee>' + price + '</total_fee>' +
        '<trade_type>JSAPI</trade_type>' +
        '<sign>' + sign + '</sign>' +
        '</xml>'
    return sendData
}

function getPayParams(prepayId, tradeId) {
    const nonceStr = getNonceStr()
    const timeStamp = new Date().getTime().toString()
    const package = 'prepay_id=' + prepayId
    const appId = appid
    const paySign = getPaySign(appId, timeStamp, nonceStr, package)
    // 前端需要的所有数据, 都从这里返回过去
    const payParamsObj = {
        nonceStr: nonceStr,
        timeStamp: timeStamp,
        package: package,
        paySign: paySign,
        signType: 'MD5',
        tradeId: tradeId,
    }
    return payParamsObj
}
