var db = require("./../utils/dba");

function getOrderBySearch() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            // select_1: '商品ID/商品名称',
            // id_or_goodsName: '',
            // start_time: '',
            // end_time: '',
            // select_2: '订单编号/物流编号',
            // tradeId_or_logistics: '',
            // select_3: ['全部', '待发货', '待付款', '已发货', '已完成', '已关闭'],
            // order_status: 0, //
            // select_4: '收货人姓名/收货人手机号',
            // userName_or_phone: '',
            // select_5: ['暂不选择', '退款中+退款成功', '退款中', '退款成功'],
            // afterSale_status: 0,
            sql = "select * from `order` where"
            let arr = []
            // id或商品名查找
            if (param['id_or_goodsName'].length > 0) {
                if (param['select_1'] == 0) {
                    sql += ' item_id = ? '
                    arr.push(param['id_or_goodsName'])
                } else if (param['select_1'] == 1) {
                    sql += ' goodsname like ?'
                    arr.push("%" + param['id_or_goodsName'] + "%")
                }
            }
            // 时间范围查找
            if (param['start_time'] && param['end_time']) {
                sql += (param['id_or_goodsName'].length > 0 ? ' and' : '') + ' create_time >= ? and create_time <= ?'
                arr.push(param['start_time'])
                arr.push(param['end_time'])
            }
            // 订单号或物流查询
            if (param['tradeId_or_logistics'].length > 0) {
                if (param['select_2'] == 0) {
                    sql += (param['id_or_goodsName'].length > 0 || (param['start_time'] && param['end_time']) ? ' and' : '') + ' tradeId = ?'
                } else if (param['select_2'] == 1) {
                    sql += (param['id_or_goodsName'].length > 0 || (param['start_time'] && param['end_time']) ? ' and' : '') + ' logistics_code = ?'
                }
                arr.push(param['tradeId_or_logistics'])
            }
            // 订单状态
            // order_status : ['全部', '待发货', '待付款', '已发货', '已完成', '已关闭']
            // sql state : -1 订单关闭（取消订单） 0 未支付（待支付） 1 已支付（待发货） 2已发货（待收货）3已收货（买家确认收货/物流送达后七天后自动确认收货 -- 待评价） 4订单完成（评价完成）
            if (param['order_status'] > 0) {
                sql += (param['id_or_goodsName'].length > 0 || (param['start_time'] && param['end_time'] || param['tradeId_or_logistics'].length > 0) ? ' and' : '') + ' state = ?'
                if (param['order_status'] == 1) {
                    arr.push(1)
                } else if (param['order_status'] == 2) {
                    arr.push(0)
                } else if (param['order_status'] == 3) {
                    arr.push(2)
                } else if (param['order_status'] == 4) {
                    arr.push(3)
                } else if (param['order_status'] == 5) {
                    arr.push(-1)
                }
            }
            // 收货人姓名/号码
            if (param['userName_or_phone'].length > 0) {
                if (param['select_4'] == 0) {
                    sql += (param['id_or_goodsName'].length > 0 || (param['start_time'] && param['end_time'] || param['tradeId_or_logistics'].length > 0 || param['order_status'] > 0) ? ' and' : '') + ' receiver like ?'
                } else if (param['select_4'] == 1) {
                    sql += (param['id_or_goodsName'].length > 0 || (param['start_time'] && param['end_time'] || param['tradeId_or_logistics'].length > 0 || param['order_status'] > 0) ? ' and' : '') + ' tel like ?'
                }
                arr.push("%" + param['userName_or_phone'] + "%")
            }
            // 退款状态
            // ['暂不选择', '退款中+退款成功', '退款中', '退款成功'],
            if (param['afterSale_status'] > 0) {
                if (param['afterSale_status'] == 1) {
                    sql += (param['id_or_goodsName'].length > 0 || (param['start_time'] && param['end_time'] || param['tradeId_or_logistics'].length > 0 || param['order_status'] > 0 || param['userName_or_phone'].length > 0) ? ' and' : '') + ' after_sale_state > ?'
                    arr.push(0)
                } else if (param['afterSale_status'] == 2) {
                    sql += (param['id_or_goodsName'].length > 0 || (param['start_time'] && param['end_time'] || param['tradeId_or_logistics'].length > 0 || param['order_status'] > 0 || param['userName_or_phone'].length > 0) ? ' and' : '') + ' after_sale_state >= ? and after_sale_state <= ?'
                    arr.push(1)
                    arr.push(3)
                } else if (param['afterSale_status'] == 3) {
                    sql += (param['id_or_goodsName'].length > 0 || (param['start_time'] && param['end_time'] || param['tradeId_or_logistics'].length > 0 || param['order_status'] > 0 || param['userName_or_phone'].length > 0) ? ' and' : '') + ' after_sale_state > ?'
                    arr.push(3)
                }
            }
            console.info(sql)
            console.info(arr)
            row = await db.Query(sql, arr);

            var rowData = row
            if (rowData.length > 0) {
                data.list = rowData
                console.info(rowData)
                for (var i in data.list) {
                    // sql = "select `name`,url,qcl,`describe` from item where id = ?"
                    sql = "select `name`,url,`describe` from item where id = ?"
                    row = await db.Query(sql, data.list[i].item_id);
                    data.list[i].name = row[0].name
                    data.list[i].url = row[0].url
                    // data.list[i].qcl = row[0].qcl
                    data.list[i].describe = row[0].describe
                }
            }
            // data.list = row

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = getOrderBySearch;