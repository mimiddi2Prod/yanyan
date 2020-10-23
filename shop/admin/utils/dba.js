var dbConfig = require('./../config/dbConfig')
var ip = dbConfig.host,
    port = dbConfig.port,
    user = dbConfig.user,
    psw = dbConfig.password,
    database = dbConfig.database

function DBA() {
}

DBA.Init = function () {
    if (!DBA.pool) {
        const mysql = require('mysql');
        DBA.pool = mysql.createPool({
            host: ip,
            port: port,
            user: user,
            password: psw,
            database: database
        })
    }
    return DBA.pool;
}
DBA.Query = function (sql, arr) {
    return new Promise(function (resolve, reject) {
        DBA.pool.getConnection(function (err, conn) {
            if (err) {
                reject(err);
                conn.release();
            } else {
                conn.query(sql, arr, function (err, res) {
                    if (err) {
                        reject(err);
                        conn.release();
                    } else {
                        res = JSON.stringify(res);
                        res = JSON.parse(res);
                        resolve(res);
                    }
                    conn.release();
                })
            }
        })
    })
};
module.exports = DBA;