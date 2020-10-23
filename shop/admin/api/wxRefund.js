// const md5 = require('md5-node')	//引入md5加密模块
// const xml2js = require('xml2js');	//引入xml解析模块
// const https = require('https');

const request = require('request')
const fs = require('fs')
const path = require('path')
// const sha256 = require('sha256')
// const CryptoJS = require('crypto-js');
// const axios = require('axios')
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
async function refund(data = {}) {
    return new Promise(function (resolve, reject) {
        console.info('开始退款')
        console.info(data)
        const attach = 'nw_t'
        // 一个随机字符串
        const nonceStr = getNonceStr()
        // 小程序的 appId
        const appId = appid
        // 微信商户号
        const mchId = mch_id
        // 订单总金额
        const total_fee = data.total_fee
        // 退款金额
        const refund_fee = data.refund_fee
        // 商户原订单号
        const tradeId = data.tradeId
        // 生成商家内部自定义的订单号, 商家内部的系统用的, 理论上只要不和其他订单重复, 使用任意的字符串都是可以的
        const refund_tradeId = getTradeId(attach)

        const refund_account = 'REFUND_SOURCE_UNSETTLED_FUNDS' // 未结算资金退款: REFUND_SOURCE_UNSETTLED_FUNDS 可用余额退款:REFUND_SOURCE_RECHARGE_FUNDS
        let resData = call(appId, mchId, nonceStr, tradeId, refund_tradeId, refund_fee, total_fee, refund_account)
        resolve(resData)
    })
}

async function call(appId, mchId, nonceStr, tradeId, refund_tradeId, refund_fee, total_fee, refund_account) {
    return new Promise(function (resolve, reject) {
        // 生成签名
        var sign = getPrePaySign(appId, mchId, nonceStr, tradeId, refund_tradeId, refund_fee, total_fee, refund_account)
        // 将微信需要的数据拼成 xml 发送出去
        const sendData = wxSendData(appId, mchId, nonceStr, tradeId, refund_tradeId, refund_fee, total_fee, refund_account, sign)

        request({
            url: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
            agentOptions: {
                cert: fs.readFileSync(path.join(__dirname, './cert/apiclient_cert.pem')),
                key: fs.readFileSync(path.join(__dirname, './cert/apiclient_key.pem'))
            },
            method: "post",
            body: sendData,
        }, function (err, body) {
            // console.info(body.body)
            // 微信返回的数据也是 xml, 使用 xmlParser 将它转换成 js 的对象
            xmlParser.parseString(body.body, (err, success) => {
                if (err) {
                    log('parser xml error ', err)
                } else {
                    console.info(success)
                    if (success.xml.return_code[0] === 'SUCCESS') {
                        if (success.xml.err_code) {
                            const err_code_des = success.xml.err_code_des[0]
                            // NOTENOUGH：<交易未结算资金不足，请使用可用余额退款> <可用余额不足，请充值后重新发起>
                            // ERROR：订单已全额退款
                            if (success.xml.err_code[0] == 'NOTENOUGH') {
                                if (err_code_des == '交易未结算资金不足，请使用可用余额退款') {
                                    // 两种模式 未结算资金退款失败 转为 可用余额退款
                                    let resData = call(appId, mchId, nonceStr, tradeId, refund_tradeId, refund_fee, total_fee, 'REFUND_SOURCE_RECHARGE_FUNDS')
                                    resolve(resData)
                                } else {
                                    // 可用余额不足，请充值后重新发起
                                    resolve(err_code_des)
                                }
                            } else if (success.xml.err_code[0] == 'ERROR') {
                                // 订单已全额退款
                                resolve(err_code_des)
                            }
                        } else {
                            // 部份退款时 没有success.xml.err_code
                            let text = ''
                            if(success.xml.refund_fee[0] == success.xml.total_fee[0]){
                                text = "订单已全额退款"
                            }else{
                                const refund = Number(success.xml.refund_fee[0]) / 100 // 微信返回金额以 '分' 为单位,手动换算成元
                                text = "已部份退款，退款金额为￥" + refund
                            }

                            resolve(text)
                        }

                    } else if (success.xml.return_code[0] !== 'FAIL') {
                        // 当退款金额超过订单总金额时 return_msg会返回invalid refund_fee
                        reject(success.xml.return_msg[0])
                    }
                }
            })
        })
    })

}

async function returnBusiness() {

}

module.exports = refund

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
    return tradeId
}

// appId, attach, mchId, nonceStr, notifyUrl, tradeId, refund_tradeId, ip, refund_fee, total_fee
function getPrePaySign(appId, mchId, nonceStr, tradeId, refund_tradeId, refund_fee, total_fee, refund_account) {
    var stringA = 'appid=' + appId +
        '&mch_id=' + mchId +
        '&nonce_str=' + nonceStr +
        '&out_refund_no=' + refund_tradeId +
        '&out_trade_no=' + tradeId +
        '&refund_account=' + refund_account + // 未结算资金退款: REFUND_SOURCE_UNSETTLED_FUNDS 可用余额退款:REFUND_SOURCE_RECHARGE_FUNDS
        '&refund_fee=' + refund_fee +
        '&total_fee=' + total_fee

    var stringSignTemp = stringA + '&key=' + PAY_API_KEY
    var sign = md5(stringSignTemp).toUpperCase()
    return sign
}


// appId, attach, mchId, nonceStr, notifyUrl, tradeId, refund_tradeId, ip, refund_fee, total_fee, sign
function wxSendData(appId, mchId, nonceStr, tradeId, refund_tradeId, refund_fee, total_fee, refund_account, sign) {
    const sendData = '<xml>' +
        '<appid>' + appId + '</appid>' +
        '<mch_id>' + mchId + '</mch_id>' +
        '<nonce_str>' + nonceStr + '</nonce_str>' +
        '<out_refund_no>' + refund_tradeId + '</out_refund_no>' +
        '<out_trade_no>' + tradeId + '</out_trade_no>' +
        '<refund_account>' + refund_account + '</refund_account>' +
        '<refund_fee>' + refund_fee + '</refund_fee>' +
        '<total_fee>' + total_fee + '</total_fee>' +

        '<sign>' + sign + '</sign>' +
        '</xml>'
    return sendData
}

// 退部份钱款：
// { xml:
// { return_code: [ 'SUCCESS' ],
//     return_msg: [ 'OK' ],
//     appid: [ 'wx14dd6120d4882a81' ],
//     mch_id: [ '1508603281' ],
//     nonce_str: [ 'g7FENOQUgEK2NaZ5' ],
//     sign: [ '9E4F507A3B7C23711BF9A0C24B792F62' ],
//     result_code: [ 'SUCCESS' ],
//     transaction_id: [ '4200000304201904124802131174' ],
//     out_trade_no: [ 'nw_155503559698455032' ],
//     out_refund_no: [ 'nw_t_155503566229484818' ],
//     refund_id: [ '50000600292019041209100886462' ],
//     refund_channel: [ '' ],
//     refund_fee: [ '1' ],
//     coupon_refund_fee: [ '0' ],
//     total_fee: [ '2' ],
//     cash_fee: [ '2' ],
//     coupon_refund_count: [ '0' ],
//     cash_refund_fee: [ '1' ] } }
// 当退部分钱款累加起来总值 == 全部付款金额时  去请求也会返回
// { xml:
// { return_code: [ 'SUCCESS' ],
//     return_msg: [ 'OK' ],
//     appid: [ 'wx14dd6120d4882a81' ],
//     mch_id: [ '1508603281' ],
//     nonce_str: [ 'XzwsDNcX6tnxoErW' ],
//     sign: [ 'C5365868A3679E4A924735B5379AF7B9' ],
//     result_code: [ 'FAIL' ],
//     err_code: [ 'ERROR' ],
//     err_code_des: [ '订单已全额退款' ] } }
//
//
// 全额退款：
// { xml:
// { return_code: [ 'SUCCESS' ],
//     return_msg: [ 'OK' ],
//     appid: [ 'wx14dd6120d4882a81' ],
//     mch_id: [ '1508603281' ],
//     nonce_str: [ 'vcSux2AWgzSlTvYM' ],
//     sign: [ 'C487465E9FA58028E7264522D29EABB4' ],
//     result_code: [ 'FAIL' ],
//     err_code: [ 'NOTENOUGH' ],
//     err_code_des: [ '交易未结算资金不足，请使用可用余额退款' ] } }
// { xml:
// { return_code: [ 'SUCCESS' ],
//     return_msg: [ 'OK' ],
//     appid: [ 'wx14dd6120d4882a81' ],
//     mch_id: [ '1508603281' ],
//     nonce_str: [ 'XzwsDNcX6tnxoErW' ],
//     sign: [ 'C5365868A3679E4A924735B5379AF7B9' ],
//     result_code: [ 'FAIL' ],
//     err_code: [ 'ERROR' ],
//     err_code_des: [ '订单已全额退款' ] } }
// { xml:
// { return_code: [ 'SUCCESS' ],
//     return_msg: [ 'OK' ],
//     appid: [ 'wx14dd6120d4882a81' ],
//     mch_id: [ '1508603281' ],
//     nonce_str: [ 'w7E9x7gnfsUgfSFo' ],
//     sign: [ 'E650A3CD292A364608029BA4795F4700' ],
//     result_code: [ 'FAIL' ],
//     err_code: [ 'NOTENOUGH' ],
//     err_code_des: [ '可用余额不足，请充值后重新发起' ] } }  // 推荐弄个退款专用号或者不设置自动提现
//
//
// 当退款金额超过 支付金额时：（正常程序逻辑运行正确时 不会发生这种情况）
// { xml:
// { return_code: [ 'FAIL' ],
//     return_msg: [ 'invalid refund_fee' ] } }