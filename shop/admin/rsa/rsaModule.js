// const crypto = require('crypto')
var fs = require('fs');
var NodeRSA = require('node-rsa')


function createPublicKey(){
    var key = new NodeRSA({b: 512});
    var publicDer = key.exportKey('public');
    var privateDer = key.exportKey('private');
    console.log('公钥:',publicDer);
    console.log('私钥:',privateDer);

    fs.writeFile('./pem/public.pem', publicDer, (err) => {
        if (err) throw err
        console.log('公钥已保存！')
    })
    fs.writeFile('./pem/private.pem', privateDer, (err) => {
        if (err) throw err
        console.log('私钥已保存！')
    })
}

// function Decrypt(src, privateKey) {
//     src  = src.replace(/\s+/g, '+')
//     let buffer2 = new Buffer(src, 'base64')
//     let decrypted = crypto.privateDecrypt({
//             key: privateKey,
//             padding: crypto.constants.RSA_PKCS1_PADDING
//         },
//         buffer2
//     )
//     return decrypted.toString('utf-8')
// }
//
// function Encrypt(src, publicKey) {
//     var key = new NodeRSA(data);
//     let cipherText = key.encryptPrivate(src, 'base64');
//     return cipherText
// }

createPublicKey()