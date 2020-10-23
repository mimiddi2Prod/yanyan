// var tools = require("./tool");
var db = require("./../utils/dba");

function shopGetGoods() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            console.info('start')
            console.info(param['state'])
            // 数据库需要加订单号 说明是同一个包裹
            // state -1全部 0在售 1售罄 2下架
            if (param['state'] == -1) {
                if (param['need_integral'] == 0) {
                    sql = "select count(id) from `item` where integral_price = ? and state != ?";
                } else if (param['need_integral'] == 1) {
                    sql = "select count(id) from `item` where integral_price > ? and state != ?";
                }

                row = await db.Query(sql, [0, 2]);
                data.number = row[0]['count(id)']
                // 全部拉取
                if (param['need_integral'] == 0) {
                    sql = "select id,`name`,image,url,price,stock,`describe`,sort2,`limit`,`type`,integral_price,sort,state,category_id_1,create_time,review_id,goods_info,label from item where integral_price = ? and state != ? ORDER BY create_time desc limit ?,?";
                } else if (param['need_integral'] == 1) {
                    sql = "select id,`name`,image,url,price,stock,`describe`,sort2,`limit`,`type`,integral_price,sort,state,category_id_1,create_time,review_id,goods_info,label from item where integral_price > ? and state != ? ORDER BY create_time desc limit ?,?";
                }
                row = await db.Query(sql, [0, 2, param['last_id'] * 5, 5]);
            } else if (param['state'] == 0) {
                // 出售中
                if (param['need_integral'] == 0) {
                    sql = "select count(id) from `item` where integral_price = ? and state = ?";
                } else if (param['need_integral'] == 1) {
                    sql = "select count(id) from `item` where integral_price > ? and state = ?";
                }

                row = await db.Query(sql, [0, 0]);
                data.number = row[0]['count(id)']

                if (param['need_integral'] == 0) {
                    sql = "select id,`name`,image,url,price,stock,`describe`,sort2,`limit`,`type`,integral_price,sort,state,category_id_1,create_time,review_id,goods_info,label from item where integral_price = ? and state = ? ORDER BY create_time desc limit ?,?";
                } else if (param['need_integral'] == 1) {
                    sql = "select id,`name`,image,url,price,stock,`describe`,sort2,`limit`,`type`,integral_price,sort,state,category_id_1,create_time,brand_id,review_id,goods_info,label from item where integral_price > ? and state = ? ORDER BY create_time desc limit ?,?";
                }
                row = await db.Query(sql, [0, 0, param['last_id'] * 5, 5]);
            } else if (param['state'] == 1) {
                // 售罄
                // sql = "select item_id from item_price where (case when stock = 0 then 0 else 1 end) = 0 and item_id not in (select item_id from item_price where (case when stock > 0 then 1 else 0 end) = 1 GROUP BY item_id) GROUP BY item_id";
                // row = await db.Query(sql);
                // let notStockItemList = row.map(function (res) {
                //     return res.item_id
                // })
                // data.number = 0
                // if (notStockItemList.length > 0) {
                //     // data.number = notStockItemList.length
                //     if (param['need_integral'] == 0) {
                //         sql = "select count(id) from `item` where integral_price = ? and id in (?)";
                //     } else if (param['need_integral'] == 1) {
                //         sql = "select count(id) from `item` where integral_price > ? and id in (?)";
                //     }
                //     row = await db.Query(sql, [0, notStockItemList.map(function (fn) {
                //         return fn
                //     })]);
                //     data.number = row[0]['count(id)']
                //
                //     if (param['need_integral'] == 0) {
                //         sql = "select id,`name`,image,url,qcl,price,`describe`,`type`,integral_price,sort,state,specification_id_1,specification_id_2,category_id_1,category_id_2,category_id_3,create_time,brand_id,review_id,goods_info from item where integral_price = ? and state = ? and id in (?) ORDER BY create_time desc limit ?,?";
                //     } else if (param['need_integral'] == 1) {
                //         sql = "select id,`name`,image,url,qcl,price,`describe`,`type`,integral_price,sort,state,specification_id_1,specification_id_2,category_id_1,category_id_2,category_id_3,create_time,brand_id,review_id,goods_info from item where integral_price > ? and state = ? and id in (?) ORDER BY create_time desc limit ?,?";
                //     }
                //     row = await db.Query(sql, [0, 0, notStockItemList.map(function (fn) {
                //         return fn
                //     }), param['last_id'] * 5, 5]);
                //     console.info(row)
                // }

                if (param['need_integral'] == 0) {
                    sql = "select count(id) from `item` where integral_price = ? and state = ? and stock = ?";
                } else if (param['need_integral'] == 1) {
                    sql = "select count(id) from `item` where integral_price > ? and state = ? and stock = ?";
                }

                row = await db.Query(sql, [0, 0, 0]);
                data.number = row[0]['count(id)']

                if (param['need_integral'] == 0) {
                    sql = "select id,`name`,image,url,price,stock,`describe`,sort2,`limit`,`type`,integral_price,sort,state,category_id_1,create_time,review_id,goods_info,label from item where integral_price = ? and state = ? and stock = ? ORDER BY create_time desc limit ?,?";
                } else if (param['need_integral'] == 1) {
                    sql = "select id,`name`,image,url,price,stock,`describe`,sort2,`limit`,`type`,integral_price,sort,state,category_id_1,create_time,brand_id,review_id,goods_info,label from item where integral_price > ? and state = ? and stock = ? ORDER BY create_time desc limit ?,?";
                }
                row = await db.Query(sql, [0, 0, 0, param['last_id'] * 5, 5]);
            } else if (param['state'] == 2) {
                // 下架
                if (param['need_integral'] == 0) {
                    sql = "select count(id) from `item` where integral_price = ? and state = ?";
                } else if (param['need_integral'] == 1) {
                    sql = "select count(id) from `item` where integral_price = ? and state = ?";
                }
                row = await db.Query(sql, [0, 1]);
                data.number = row[0]['count(id)']

                if (param['need_integral'] == 0) {
                    sql = "select id,`name`,image,url,price,stock,`describe`,sort2,`limit`,`type`,integral_price,sort,state,category_id_1,create_time,review_id,goods_info,label from item where integral_price = ? and state = ? ORDER BY create_time desc limit ?,?";
                } else if (param['need_integral'] == 1) {
                    sql = "select id,`name`,image,url,price,stock,`describe`,sort2,`limit`,`type`,integral_price,sort,state,category_id_1,create_time,review_id,goods_info,label from item where integral_price > ? and state = ? ORDER BY create_time desc limit ?,?";
                }
                row = await db.Query(sql, [0, 1, param['last_id'] * 5, 5]);
            }

            var rowData = row
            // console.info(rowData)
            if (rowData.length > 0) {
                data.list = rowData
                // console.info(rowData)
                // 已售完
                // if (param['state'] == 1) {
                //     for (let i = data.list.length; i > 0; i--) {
                //         sql = "select count(id) from item_price where item_id = ? and stock != ?";
                //         row = await query(sql, [data.list[i].id, 0]);
                //         if (row[0]['count(id)'] > 0) {
                //             data.number = data.number - 1
                //             data.list.splice(i, 1)
                //             // continue
                //         }
                //     }
                //
                // }
                // console.info(data.list)
                for (let i in data.list) {
                    data.list[i].image = JSON.parse(data.list[i].image)
                    data.list[i].label = data.list[i].label ? JSON.parse(data.list[i].label) : ''
                    data.list[i].goods_info = JSON.parse(data.list[i].goods_info)

                    // if (data.list[i].id) {
                    //     sql = "select id,param_id_1,param_id_2,stock,price from item_price where item_id = ?"
                    //     row = await db.Query(sql, data.list[i].id)
                    //     data.list[i].param = row
                    //
                    //     // 已售完
                    //     // if (param['state'] == 1) {
                    //     //     sql = "select count(id) from item_price where item_id = ? and stock != ?";
                    //     //     row = await query(sql, [data.list[i].id, 0]);
                    //     //     if (row[0]['count(id)'] > 0) {
                    //     //         data.number = data.number - 1
                    //     //         data.list.splice(i, 1)
                    //     //         continue
                    //     //     }
                    //     // }
                    // }

                    if (data.list[i].category_id_1) {
                        sql = "select name,parent_id from category where id = ?"
                        row = await db.Query(sql, data.list[i].category_id_1)
                        data.list[i].category_name_1 = row[0].name

                        sql = "select id from category where id = ?"
                        row = await db.Query(sql, row[0].parent_id)
                        data.list[i].category_parent_id = row[0].id
                    }

                    // let total_volume = 0
                    // for (let j in data.list[i].param) {
                    //     if (data.list[i].param[j].param_id_1) {
                    //         sql = "select param,image from item_param where id = ?"
                    //         row = await db.Query(sql, data.list[i].param[j].param_id_1)
                    //         if (row[0].image) {
                    //             data.list[i].param[j].image = row[0].image
                    //         }
                    //         data.list[i].param[j].param_1 = row[0].param
                    //     }
                    //
                    //     if (data.list[i].param[j].param_id_2) {
                    //         sql = "select param,image from item_param where id = ?"
                    //         row = await db.Query(sql, data.list[i].param[j].param_id_2)
                    //         if (row[0].image) {
                    //             data.list[i].param[j].image = row[0].image
                    //         }
                    //         data.list[i].param[j].param_2 = row[0].param
                    //     }
                    //
                    //     sql = "select sum(`number`) from `order` where param_id_1 = ? and param_id_2 = ? and state = ?"
                    //     row = await db.Query(sql, [data.list[i].param[j].param_id_1, data.list[i].param[j].param_id_2, 3])
                    //     if (row[0]['sum(`number`)'] == null) {
                    //         data.list[i].param[j].volume = 0
                    //     } else {
                    //         data.list[i].param[j].volume = row[0]['sum(`number`)']
                    //     }
                    //     total_volume = total_volume + row[0]['sum(`number`)']
                    // }
                    // data.list[i].volume = total_volume

                    sql = "select sum(`number`) from `order` where item_id = ? and state = ?"
                    row = await db.Query(sql, [data.list[i].id, 3])
                    if (row[0]['sum(`number`)'] == null) {
                        data.list[i].volume = 0
                    } else {
                        data.list[i].volume = row[0]['sum(`number`)']
                    }
                }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetGoods;