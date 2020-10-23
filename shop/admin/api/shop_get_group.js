// var tools = require("./tool");
var db = require("./../utils/dba");

function shopGetGroup() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (param['state'] != 2) {
                let current_time = new Date()
                // state 0正在团购 1团购确认 2添加团购
                if (param['state'] == 0) {
                    // sql = "select count(id) from group_buy where end_time > ? and founded <= ?";
                    // row = await query(sql, [current_time, 0]);
                    sql = "select count(id) from group_buy where founded <= ?";
                    row = await db.Query(sql, 0);
                    data.number = row[0]['count(id)']

                    // sql = "select item_id,founded from group_buy where end_time > ? and founded <= ? ORDER BY end_time desc limit ?,?";
                    // row = await query(sql, [current_time, 0, param['last_id'] * 5, 5]);
                    sql = "select item_id,founded,start_time,end_time from group_buy where founded <= ? ORDER BY end_time desc limit ?,?";
                    row = await db.Query(sql, [0, param['last_id'] * 5, 5]);
                } else if (param['state'] == 1) {
                    // sql = "select count(id) from group_buy where end_time <= ? or founded = ?";
                    // row = await query(sql, [current_time, 1]);
                    sql = "select count(id) from group_buy where founded = ?";
                    row = await db.Query(sql, 1);
                    data.number = row[0]['count(id)']

                    // sql = "select item_id,founded from group_buy where end_time <= ? or founded = ? ORDER BY end_time desc limit ?,?";
                    // row = await query(sql, [current_time, 1, param['last_id'] * 5, 5]);
                    sql = "select item_id,founded,start_time,end_time from group_buy where founded = ? ORDER BY end_time desc limit ?,?";
                    row = await db.Query(sql, [1, param['last_id'] * 5, 5]);
                }

                var rowData = row
                if (rowData.length > 0) {
                    console.info(rowData)
                    for (let i in rowData) {
                        sql = "select id,`name`,image,url,qcl,price,`describe`,`type`,integral_price,sort,state,specification_id_1,specification_id_2,category_id_1,category_id_2,category_id_3,create_time,brand_id,review_id,goods_info from item where state = ? and id = ?";
                        row = await db.Query(sql, [0, rowData[i].item_id]);
                        rowData[i] = Object.assign(rowData[i], row[0])
                    }
                    data.list = rowData
                    for (let i in data.list) {
                        data.list[i].image = JSON.parse(data.list[i].image)
                        data.list[i].goods_info = JSON.parse(data.list[i].goods_info)

                        if (data.list[i].id) {
                            sql = "select id,param_id_1,param_id_2,stock,price from item_price where item_id = ?"
                            row = await db.Query(sql, data.list[i].id)
                            data.list[i].param = row

                            sql = "select sum(`number`) from `order` where item_id = ? and after_sale_state = ?"
                            row = await db.Query(sql, [data.list[i].id, 4])
                            if (row[0]['sum(`number`)'] == null) {
                                data.list[i].refundNumber = 0
                            } else {
                                data.list[i].refundNumber = row[0]['sum(`number`)']
                            }
                        }

                        if (data.list[i].category_id_1) {
                            sql = "select name,parent_id from category where id = ?"
                            row = await db.Query(sql, data.list[i].category_id_1)
                            data.list[i].category_name_1 = row[0].name

                            sql = "select id from category where id = ?"
                            row = await db.Query(sql, row[0].parent_id)
                            data.list[i].category_parent_id = row[0].id
                        }

                        let total_volume = 0
                        for (let j in data.list[i].param) {
                            if (data.list[i].param[j].param_id_1) {
                                sql = "select param,image from item_param where id = ?"
                                row = await db.Query(sql, data.list[i].param[j].param_id_1)
                                if (row[0].image) {
                                    data.list[i].param[j].image = row[0].image
                                }
                                data.list[i].param[j].param_1 = row[0].param
                            }

                            if (data.list[i].param[j].param_id_2) {
                                sql = "select param,image from item_param where id = ?"
                                row = await db.Query(sql, data.list[i].param[j].param_id_2)
                                if (row[0].image) {
                                    data.list[i].param[j].image = row[0].image
                                }
                                data.list[i].param[j].param_2 = row[0].param
                            }

                            sql = "select sum(`number`) from `order` where param_id_1 = ? and param_id_2 = ? and state = ?"
                            row = await db.Query(sql, [data.list[i].param[j].param_id_1, data.list[i].param[j].param_id_2, 1])
                            console.info(row)
                            if (row[0]['sum(`number`)'] == null) {
                                data.list[i].param[j].volume = 0
                            } else {
                                data.list[i].param[j].volume = row[0]['sum(`number`)']
                            }
                            total_volume = total_volume + row[0]['sum(`number`)']
                        }
                        data.list[i].volume = total_volume
                    }
                }
            } else if (param['state'] == 2) {
                sql = "select item_id from group_buy";
                row = await db.Query(sql);
                let group_id_list = row

                sql = "select count(id) from item where state = ? and group_id <= ? and integral_price <= ?";
                row = await db.Query(sql, [0, 0, 0]);
                data.number = row[0]['count(id)']

                sql = "select id,`name`,image,url,qcl,price,`describe`,`type`,integral_price,sort,state,specification_id_1,specification_id_2,category_id_1,category_id_2,category_id_3,create_time,brand_id,review_id,goods_info from item where state = ? and id not in (?) and integral_price <= ? ORDER BY create_time desc limit ?,?";
                if(group_id_list.length > 0){
                    row = await db.Query(sql, [0, group_id_list.map(function (fn) {
                        return fn.item_id
                    }), 0, param['last_id'] * 5, 5]);
                }else{
                    row = await db.Query(sql, [0, 0, 0, param['last_id'] * 5, 5]);
                }


                var rowData = row
                if (rowData.length > 0) {
                    data.list = rowData
                    for (let i in data.list) {
                        data.list[i].image = JSON.parse(data.list[i].image)
                        data.list[i].goods_info = JSON.parse(data.list[i].goods_info)

                        if (data.list[i].id) {
                            sql = "select id,param_id_1,param_id_2,stock,price from item_price where item_id = ?"
                            row = await db.Query(sql, data.list[i].id)
                            data.list[i].param = row
                        }

                        if (data.list[i].category_id_1) {
                            sql = "select name,parent_id from category where id = ?"
                            row = await db.Query(sql, data.list[i].category_id_1)
                            data.list[i].category_name_1 = row[0].name

                            sql = "select id from category where id = ?"
                            row = await db.Query(sql, row[0].parent_id)
                            data.list[i].category_parent_id = row[0].id
                        }

                        let total_volume = 0
                        for (let j in data.list[i].param) {
                            if (data.list[i].param[j].param_id_1) {
                                sql = "select param,image from item_param where id = ?"
                                row = await db.Query(sql, data.list[i].param[j].param_id_1)
                                if (row[0].image) {
                                    data.list[i].param[j].image = row[0].image
                                }
                                data.list[i].param[j].param_1 = row[0].param
                            }

                            if (data.list[i].param[j].param_id_2) {
                                sql = "select param,image from item_param where id = ?"
                                row = await db.Query(sql, data.list[i].param[j].param_id_2)
                                if (row[0].image) {
                                    data.list[i].param[j].image = row[0].image
                                }
                                data.list[i].param[j].param_2 = row[0].param
                            }

                            sql = "select sum(`number`) from `order` where param_id_1 = ? and param_id_2 = ? and state = ?"
                            row = await db.Query(sql, [data.list[i].param[j].param_id_1, data.list[i].param[j].param_id_2, 3])
                            if (row[0]['sum(`number`)'] == null) {
                                data.list[i].param[j].volume = 0
                            } else {
                                data.list[i].param[j].volume = row[0]['sum(`number`)']
                            }
                            total_volume = total_volume + row[0]['sum(`number`)']
                        }
                        data.list[i].volume = total_volume
                    }
                }
            }


            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopGetGroup;