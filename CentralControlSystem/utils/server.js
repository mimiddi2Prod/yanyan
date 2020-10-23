function API() {
}

API.prototype.run = async function (apiName, params) {
    return new Promise(async function (resolve, reject) {
        switch (apiName) {
            case "test": {
                resolve(await require('./../apis/api_test.js').test(params))
                break;
            }
            case "getCardExt": {
                resolve(await require('../apis/api_get_cardExt.js').getCardExt(params))
                break;
            }
            case "getCard": {
                resolve(await require('../apis/api_get_card.js').getCard(params))
                break;
            }
            case "consumeCard": {
                resolve(await require('../apis/api_consume_card.js').getConsumeCard(params))
                break;
            }
            default:
                reject({
                    err: 1,
                    msg: 'no api'
                })
                break;
        }
    })
};

module.exports = API;
