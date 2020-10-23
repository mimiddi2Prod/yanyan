var db = require("./../utils/dba");
const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopUpdateGoods() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (!param['user_id'].toString()) {
                console.info('user_id没有获取到')
            } else if (!param['goods_id']) {
                console.info('商品Id没有获取到')
            } else if (param['imgList'].length <= 0) {
                console.info('商品图片没有获取到')
            } else if (!param['goods_title']) {
                console.info('goods_title没有获取到')
            } else if (!param['goods_desc']) {
                console.info('goods_desc没有获取到')
            } else if (!param['goods_sort2'].toString().length) {
                console.info('goods_sort2没有获取到')
            }
            // else if (!param['goods_brand_id']) {
            //     console.info('goods_brand_id没有获取到')
            // }
            // else if (!param['qcl_id']) {
            //     console.info('qcl_id没有获取到')
            // }
            else if (!param['type'].toString()) {
                console.info('type没有获取到')
            } else if (!param['integralValue'].toString()) {
                console.info('integralValue没有获取到')
            } else if (!param['category_id_select']) {
                console.info('category_id_select没有获取到')
            }
            // else if (param['paramItem'].length <= 0) {
            //     console.info('paramItem没有获取到')
            // } else if (param['paramAndPrice'].length <= 0) {
            //     console.info('paramAndPrice没有获取到')
            // }
            else if (!param['price'].toString()) {
                console.info('price没有获取到')
            } else if (!param['stock'].toString()) {
                console.info('stock没有获取到')
            } else if (!param['goodsInfoImgList']) {
                console.info('goodsInfoImgList没有获取到')
            } else if (!param['state'].toString()) {
                console.info('state没有获取到')
            } else {
                // var qiniuRootUrl = "http://notwastingqiniu.minidope.com/"
                let goodsImg = param["imgList"].map(function (res) {
                    if (res.key) {
                        return qiniuRootUrl + res.key
                    }
                    return res.tempFilePath
                })
                goodsImg = JSON.stringify(goodsImg)
                console.info(goodsImg)

                let label = param["label"].map(function (res) {
                    if (res.key) {
                        return qiniuRootUrl + res.key
                    }
                    return res.tempFilePath
                })
                label = label.length ? JSON.stringify(label) : null

                let goodsInfo = param["goodsInfoImgList"].map(function (res) {
                    if (res.key) {
                        return qiniuRootUrl + res.key
                    }
                    return res.tempFilePath
                })
                goodsInfo = JSON.stringify(goodsInfo)
                let url = '../goods/goods'  // 之后如果需要别的路径，再行更改，目前默认写死
                // type:0 item,1 topic,2
                // state:0 上架 1 下架
                sql = "update item set `name` = ?,image = ?,url = ?,price = ?,stock = ?,`describe` = ?,sort2 = ?,`limit` = ?,`type` = ?,integral_price = ?,state = ?,user_id = ?,category_id_1 = ?,create_time = CURRENT_TIMESTAMP,review_id = ?,goods_info = ?,label = ? where id = ?";
                row = await db.Query(sql, [param['goods_title'], goodsImg, url, param['price'], param['stock'], param['goods_desc'], param['goods_sort2'], param['goods_limit'], param['type'], param['integralValue'], param['state'], param['user_id'], param['category_id_select'], 0, goodsInfo, label, param['goods_id']]);
                if (row.changedRows == 1) {
                    data.text = '更新成功'
                }
                // item 更新完成
                // if (row.changedRows == 1) {
                //     let item_id = param['goods_id']
                //     let insert_param_list = []
                //
                //     sql = "delete from item_param where item_id = ?"
                //     row = await db.Query(sql, item_id);
                //
                //     sql = "delete from item_price where item_id = ?"
                //     row = await db.Query(sql, item_id);
                //
                //     for (let i in param['paramItem']) {
                //         if (param['paramItem'][i].haveParamImg) {
                //             param['paramItem'][i].size = param['paramItem'][i].size.map(function (f) {
                //                 if (f.img[0].key) {
                //                     f.img = qiniuRootUrl + f.img[0].key
                //                 } else {
                //                     f.img = f.img[0].tempFilePath
                //                 }
                //                 return f
                //             })
                //         } else {
                //             param['paramItem'][i].size = param['paramItem'][i].size.map(function (f) {
                //                 f.img = ''
                //                 return f
                //             })
                //         }
                //
                //         for (let j in param['paramItem'][i].size) {
                //             sql = "insert into item_param(item_id,specification_id,param,image,user_id,create_time)values(?,?,?,?,?,CURRENT_TIMESTAMP)";
                //             row = await db.Query(sql, [item_id, param['paramItem'][i].select_id, param['paramItem'][i].size[j].name, param['paramItem'][i].size[j].img, param['user_id']]);
                //             if (row.insertId) {
                //                 insert_param_list.push({
                //                     name: param['paramItem'][i].size[j].name,
                //                     id: row.insertId
                //                 })
                //             }
                //         }
                //     }
                //     // item_param商品参数添加完成
                //     let paramAndPrice = param['paramAndPrice'].map(function (f) {
                //         for (let k in insert_param_list) {
                //             if (insert_param_list[k].name == f.param_1) {
                //                 f.param_id_1 = insert_param_list[k].id
                //             }
                //             if (insert_param_list[k].name == f.param_2) {
                //                 f.param_id_2 = insert_param_list[k].id
                //             }
                //         }
                //         return f
                //     })
                //     console.info(paramAndPrice)
                //     let flag = 0
                //     for (let l in paramAndPrice) {
                //         sql = "insert into item_price(param_id_1,param_id_2,stock,price,item_id,user_id,create_time)values(?,?,?,?,?,?,CURRENT_TIMESTAMP)";
                //         row = await db.Query(sql, [paramAndPrice[l].param_id_1, paramAndPrice[l].param_id_2, paramAndPrice[l].stock, paramAndPrice[l].price, item_id, param['user_id']]);
                //         if (row.insertId) {
                //             flag++
                //             if (flag == paramAndPrice.length) {
                //                 data.text = '更新成功'
                //             }
                //         }
                //     }
                // }
            }

            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = shopUpdateGoods;