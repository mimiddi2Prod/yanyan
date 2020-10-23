const mysql = require("mysql");
const {dbConfig} = require('../config/dbConfig')
const pool = mysql.createPool(dbConfig);

let query = function (sql, arr) {
    return new Promise(function (resovle, reject) {
        pool.getConnection(function (err, conn) {
            if (err) {
                reject(err);
            } else {
                conn.query(sql, arr, function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        res = JSON.stringify(res);
                        res = JSON.parse(res);
                        resovle(res);
                    }
                    conn.release();
                })
            }
        })
    });
}

/**
 * 批量插入多组数据
 * table:数据库表名
 * list:[{key1:value1,key2:value2},{key1:value3,key2:value4}]
 */
let BulkInsert = async function (table, list) {
    return new Promise(async function (resolve, reject) {
        if (isEmpty(list)) {
            resolve({
                errmsg: "sql is error,list not to exist"
            })
        }
        let keys = Object.keys(list[0])
        let sql = "insert into " + "`" + table + "` (`" + keys.join("`,`") + "`) values "
        let string_1 = "(" + (() => {
            let temp = []
            keys.forEach(() => {
                temp.push("?")
            })
            return temp
        })() + ")"
        let string_2 = (() => {
            let temp = []
            list.forEach(() => {
                temp.push(string_1)
            })
            return temp
        })()
        sql += string_2
        // 整理获得插入数据
        let arr = []
        list.forEach((value) => {
            arr = arr.concat(Object.values(value))
        })
        let row = await query(sql, arr)
        // 添加数据对应的id列表
        let id_list = []
        if (row.affectedRows == list.length) {
            for (let i = 0; i < row.affectedRows; i++) {
                id_list[i] = row.insertId + i
            }
            resolve({
                id_list: id_list,
                errmsg: "success"
            })
        } else {
            resolve({
                errmsg: "insert failed"
            })
        }
    })
}

/**
 * 批量更新多组数据
 * 原语法示例：
 *  UPDATE restaurant_goods
 *    SET `describe` = CASE `name`
 *    WHEN "蜜桃杯子" THEN 'value1122'
 *    WHEN "蓝莓伯爵戚风切件" THEN 'value2222'
 *    END,
 *    `stock` = CASE `name`
 *    WHEN "蜜桃杯子" THEN 22
 *    WHEN "蓝莓伯爵戚风切件" THEN 33
 *    END
 *    WHERE `name` IN ("蜜桃杯子","蓝莓伯爵戚风切件")
 *
 * 示例2：
 *  UPDATE restaurant_goods
 *    SET `describe` =
 *    CASE
 *    WHEN `name` = "蜜桃杯子" and location_code = "xmspw" THEN "sdw2"
 *    WHEN `name` = "蓝莓伯爵戚风切件" and location_code = "xmspw" THEN "www2"
 *    ELSE `describe`
 *    END,
 *    `stock` =
 *    CASE
 *    WHEN `name` = "蜜桃杯子" THEN 11
 *    WHEN `name` = "蓝莓伯爵戚风切件" THEN 22
 *    ELSE `stock`
 *    END
 * table:数据库表名
 * list:[
 *  {when:{"w_key1:w_value1",...},then:{k_1:v_1,k_2:v_2}},
 *  {when:{"w_key1:w_value2",...},then:{k_1:v_3,k_2:v_4}}
 *  ]
 */
let BulkUpdate = async function (table, list) {
    return new Promise(async function (resolve, reject) {
        if (isEmpty(list)) {
            resolve({
                errmsg: "sql is error,list not to exist"
            })
        }

        let then_keys = Object.keys(list[0]["then"]), when_keys = Object.keys(list[0]["when"])
        let sql = "update " + "`" + table + "` set "
        let str_arr = []
        for (let i = 0; i < then_keys.length; i++) {
            let str = "`" + then_keys[i] + "` = case "
            for (let j in list) {
                // when
                str += " when " + (() => {
                    let temp = []
                    when_keys.forEach(m => {
                        temp.push("`" + m + "` = '" + list[j]["when"][m] + "'")
                    })
                    return temp.join(" and ")
                })()
                // then
                str += " then '" + list[j]["then"][then_keys[i]] + "'"
            }
            str += " else `" + then_keys[i] + "` end"
            str_arr.push(str)
        }
        sql += str_arr.join(",")
        // console.info("sql", sql)
        let row = await query(sql)
        // console.info("row", row)
        // 添加数据对应的id列表
        let id_list = []
        if (row.changedRows == then_keys.length) {
            for (let i = 0; i < row.changedRows; i++) {
                id_list[i] = row.insertId + i
            }
            resolve({
                id_list: id_list,
                errmsg: "success"
            })
        } else {
            resolve({
                errmsg: "insert failed"
            })
        }
    })
}

module.exports = {
    query: query,
    BulkInsert: BulkInsert,
    BulkUpdate: BulkUpdate
}

/**
 * 是否为空
 * */
function isEmpty(obj) {
    //检验null和undefined
    if (!obj && obj !== 0 && obj !== '') {
        return true;
    }
    //检验数组
    if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
        return true;
    }
    //检验对象
    if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
        return true;
    }
    return false;
}
