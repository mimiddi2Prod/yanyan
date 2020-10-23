var db = require("./../utils/dba");
// const privateKey = require("./../utils/getPrivateKey").Get();

module.exports = async function (cookie) {
    let data = {}
    console.info(cookie)
    if (!cookie.token) {
        data.text = false
        return data
    } else {
        if (cookie.token.length <= 0) {
            data.text = false
            return data
        } else {
            let sql = 'select `type`,token_expire from admin where token = ?'
            let row = await db.Query(sql, cookie.token)
            if (row.length > 0) {
                data.type = row[0].type
                let current_time = new Date()
                let token_expire = new Date(row[0].token_expire)
                if (token_expire > current_time) {
                    data.text = true
                    return data
                } else {
                    data.text = false
                    return data
                }
            }else{
                data.text = false
                return data
            }
        }
    }

    // if (cookie.c_id) {
    //     let user_id = cookie.id
    //     let c_id = cookie.c_id
    //
    //     const privateKey = fs.readFileSync(path.join(__dirname, '../rsa/pem/private.pem')).toString('utf-8')
    //     const idAddtimeString = Decrypt(c_id, privateKey)
    //
    //     let sql = "select last_login_time from admin where id = ?";
    //     let row = await db.Query(sql, user_id);
    //     if (row.length > 0) {
    //         let time = new Date(row[0].last_login_time)
    //         console.info(time)
    //         console.info(idAddtimeString)
    //         if ((user_id + time.getTime().toString()) == idAddtimeString) {
    //             data.text = true
    //             return data
    //         }
    //     }
    // }

}

// function Decrypt(src, privateKey) {
//     src = src.replace(/\s+/g, '+')
//     let buffer2 = new Buffer(src, 'base64')
//     let decrypted = crypto.privateDecrypt({
//             key: privateKey,
//             padding: crypto.constants.RSA_PKCS1_PADDING
//         },
//         buffer2
//     )
//     return decrypted.toString('utf-8')
// }