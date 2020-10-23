// 银豹收银机文档地址
// http://pospal.cn/openplatform/productorderapi.html

const md5 = require('blueimp-md5') // 银豹组合appkey加密
const https = require('https');
const yinbaoConfig = require('./../config/yinbaoConfig')

module.exports = async function request(router, postDataJson) {
    // console.info(router)
    // console.info(postDataJson)
    const appKey = yinbaoConfig.appKey
    let timeStamp = new Date().getTime()

    let sign = md5(appKey + postDataJson).toUpperCase()

    let path = await getPath(router)

    var options = {
        host: yinbaoConfig.host,
        port: yinbaoConfig.port,
        path: path,
        method: 'POST',
        form: postDataJson,
        headers: {
            'User-Agent': 'openApi',
            'Content-Type': 'application/json;charset=utf-8',
            'accept-encoding': 'gzip,deflate',
            'time-stamp': timeStamp,
            'data-signature': sign,
        },
    }

    let e = await HttpsPost(options, postDataJson, sign)
    return e
}

async function getPath(router) {
    let path = '/pospal-api2/openapi/v1/'
    switch (router) {
        case "queryProductCategoryPages":
            path += 'productOpenApi/queryProductCategoryPages'; // 分页查询全部商品分类
            break;
        case "queryProductPages":
            path += 'productOpenApi/queryProductPages'; // 分页查询全部商品 (可根据分类id)
            break;
        case "queryProductImagePages":
            path += 'productOpenApi/queryProductImagePages'; // 分页查询全部商品图片 （只会查询有图片的，请确保商品有图片可查）
            break;
        case "updateBalancePointByIncrement":
            path += 'customerOpenApi/updateBalancePointByIncrement'; // 修改会员余额积分
            break;
        case "queryTicketPages":
            path += 'ticketOpenApi/queryTicketPages'; // 分页查询所有单据
            break;
        case "queryDailyAccessTimesLog":
            path += 'openApiLimitAccess/queryDailyAccessTimesLog'; // 查询接口访问量
            break;
        default:
            console.info('没有发现能够匹配的path')
            return;
    }

    return path
}

async function HttpsPost(option, postData, sign) {
    return new Promise(function (resolve, reject) {
        var req = https.request(option, function (res) {
            let data = '';
            res.headers = {
                'data-signature': sign,
                'Content-Type': 'application/json;charset=UTF-8'
            }
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data += chunk;
            })
            res.on('end', function (e) {
                resolve(data)
            })
        })
        req.write(postData);
        req.end();
    })
}

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