var db = require("./../utils/dba");

function orderDetail() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            console.info('start')
            console.info(param['order_id'])
            if (param['order_id']) {
                // sql = "select item_id,user_id,param_id_1,param_id_2,param_1,param_2,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state,have_cost_integral,logistics_code from `order` where id = ?";
                sql = "select item_id,user_id,image,`number`,update_time,create_time,state,address_text,tel,receiver,single_price,postage,id,tradeId,after_sale_state,have_cost_integral,select_card_id,discount_price from `order` where id = ?";
                console.info(sql)
                row = await db.Query(sql, param['order_id']);
            } else {
                console.info('错误')
            }
            var rowData = row
            console.info(rowData)
            if (rowData.length > 0) {
                data = rowData
                // console.info(rowData)
                for (var i in data) {
                    // sql = "select `name`,url,qcl,`describe` from item where id = ?"
                    sql = "select `name`,url,`describe` from item where id = ?"
                    row = await db.Query(sql, data[i].item_id);
                    data[i].name = row[0].name
                    data[i].url = row[0].url
                    data[i].qcl = row[0].qcl
                    data[i].describe = row[0].describe

                    // if (data[i].param_id_1) {
                    //     sql = "select param,image from item_param where id = ?"
                    //     row = await query(sql, data[i].param_id_1)
                    //     if (row[0].image) {
                    //         data[i].image = row[0].image
                    //     }
                    //     data[i].param_1 = row[0].param
                    // }
                    //
                    // if (data[i].param_id_2) {
                    //     sql = "select param,image from item_param where id = ?"
                    //     row = await query(sql, data[i].param_id_2)
                    //     if (row[0].image) {
                    //         data[i].image = row[0].image
                    //     }
                    //     data[i].param_2 = row[0].param
                    // }

                    // 如果售后状态非0 需要获取售后表信息
                    if (rowData.after_sale_state != 0) {
                        sql = "select refund,total_refund,reason,description,image,address,`number` from aftersale where order_id = ? and state = ?"
                        row = await db.Query(sql, [param['order_id'], 0])
                        console.info(row)
                        if (row.length > 0) {
                            if (row[0].image.length > 0) {
                                row[0].image = JSON.parse(row[0].image)
                            }
                            if (row[0].address.length > 0) {
                                row[0].address = JSON.parse(row[0].address)
                            }
                        }
                        data[i].aftersale = row
                    }
                }
            }
            // sql = "select count(id) from `order`";
            // row = await query(sql);
            // data.number = row[0]['count(id)']
            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
        //    connection.query('SELECT * FROM `order`',function (err, result) {
        //     if(err){
        //       console.log('[SELECT ERROR] - ',err.message);
        //       return;
        //     } else if(!result.length){
        //       console.info('查询失败')
        //       return callback(1);
        //     }
        //
        //    console.log('查询成功');
        //  console.info(result)
        //    return callback(result);
        // });
    }
}

module.exports = orderDetail;