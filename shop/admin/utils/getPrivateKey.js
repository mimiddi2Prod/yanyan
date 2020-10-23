var fs = require('fs');
const path = require('path')

function PrivateKey() {

}

PrivateKey.Init = function () {
    PrivateKey.privateKeyStr = fs.readFileSync(path.join(__dirname, '../rsa/pem/private.pem')).toString('utf-8')
}


PrivateKey.Get = function () {
    return PrivateKey.privateKeyStr
};

module.exports = PrivateKey;