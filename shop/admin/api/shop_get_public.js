var fs = require('fs');
const path = require('path')

function shopGetPublic() {
    this.Service = async function (version, param, callback) {
        var data = {}
        try {
            const publicKey = fs.readFileSync(path.join(__dirname,'../rsa/pem/public.pem')).toString('utf-8')
            data.key = publicKey
            // fs.readFile('../rsa/pem/public.pem', function (err, data) {
            //     console.info(data)
            //     var key = new NodeRSA(data);
            //     console.info(key)
            //     let src = "P4Q9OadJFsoJt+SznJ+H5Mz0rHF09UFqqaal5SaC5AZ3vIB/1j3TcIZ1UW38CozjwaLEqTbU1HQRmkH21Nyd+Q=="
            //     src = src.replace(/\s+/g, '+')
            //     console.info(src)
            //     let rawText = key.decrypt(src, 'utf8');
            //     console.log(rawText);
            // });

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetPublic;