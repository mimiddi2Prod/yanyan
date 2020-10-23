var db = require("./../utils/dba");

exports.test = async function (params) {
    let data = {}
    return new Promise(async function (resolve, reject) {
        let row = await db.Select('*', 'test', ['type', 'state'], [0, 4])
        data = row
        if (data) {
            resolve({
                err: 0,
                data: {
                    params: params,
                    data: data
                },
                msg: 'request success'
            })
        } else {
            reject({
                err: 1,
                msg: 'request fail'
            })
        }
    })

};
