// var db = require("./../utils/dba");
var wechatApi = require("./../utils/wechat_api")
var sha1 = require("js-sha1")

exports.getConsumeCard = async function (params) {
    return new Promise(async function (resolve, reject) {
        // 核销公众号卡券
        let data = await getConsumeCardResult(params)
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

/**
 * 0.获取access_token (已全局存储获取)
 * 1.将获取到的encrypt_code解密 card/code/decrypt?access_token=?  data:encrypt_code
 * 2.查询是否能够核销 card/code/get?access_token=? data:code,cardId
 * 3.核销 card/code/consume?access_token=?
 */
async function getConsumeCardResult(params) {
    let data = {
        err: null,
        result: {}
    }
    let code = null
    await decrypt(params['encrypt_code']).then(function (result) {
        code = result.code
    }).catch(function (err) {
        data.err = err
    })

    if(data.err){
        return data
    }

    let  consume_info = null
    await getCode(code,params['card_id']).then(function (result) {
        consume_info = result
    }).catch(function (err) {
        data.err = err
    })

    if(data.err){
        return data
    }

    if(consume_info.errcode == 0 && consume_info.can_consume){
        // 券可以被核销
        await consumeCode(code,params['card_id']).then(function (result) {
            data.result = result
        }).catch(function (err) {
            data.err = err
        })
    }else{
        // 券不能被核销
        // todo 对券不能被核销的情况进行处理
        data.err = null
        data.result = consume_info
    }

    return data
}

async function decrypt(encrypt_code) {
    return new Promise(function (resolve, reject) {
        wechatApi.api.decryptCode(encrypt_code,function (err,result) {
            if (err) reject(err);
            resolve(result)
        })
    })
}

/**
   {
    errcode: 0,
    errmsg: 'ok',
    card: {
    card_id: 'pEl0pw15t2pTM0UfBq4VQG0qUx_o',
        begin_time: 1575820800,
        end_time: 1576771199,
        code: '201488561444'
    },
    openid: 'oEl0pw6w0z9mTP8G7MUwRV8hdtK8',
    can_consume: true,
    user_card_status: 'NORMAL',
    unionid: 'oAAAAAHE2b4tmCSJfy8KPuxVhM3A'
    }
 */
async function getCode(code,card_id) {
    return new Promise(function (resolve, reject) {
        wechatApi.api.getCode(code,card_id, function (err, result) {
            if(result.errcode != 0){
                resolve(result)
            }else{
                if (err) reject(err);
                resolve(result)
            }
        })
    })
}

async function consumeCode(code,card_id) {
    return new Promise(function (resolve, reject) {
        wechatApi.api.consumeCode(code,card_id, function (err, result) {
            if (err) reject(err);
            resolve(result)
        })
    })
}