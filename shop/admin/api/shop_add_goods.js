var db = require("./../utils/dba");
const qiniuRootUrl = require("./../config/qiniuConfig").qiniuRootUrl

function shopAddGoods() {
    // var tool = new tools;
    // var query = tool.query;
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            if (!param['user_id'].toString()) {
                console.info('user_id没有获取到')
            } else if (param['imgList'].length <= 0) {
                console.info('商品图片没有获取到')
            } else if (!param['goods_title']) {
                console.info('goods_title没有获取到')
            } else if (!param['goods_desc']) {
                console.info('goods_desc没有获取到')
            } else if (!param['goods_sort2']) {
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
                // var qiniuRootUrl = "http://ppburep37.bkt.clouddn.com/"  //七牛云测试域名
                let goodsImg = param["imgList"].map(function (res) {
                    return qiniuRootUrl + res
                })
                goodsImg = JSON.stringify(goodsImg)

                let label = param["label"] ? param["label"].map(function (res) {
                    return qiniuRootUrl + res
                }) : ''
                label = JSON.stringify(label)

                let goodsInfo = param["goodsInfoImgList"].map(function (res) {
                    return qiniuRootUrl + res
                })
                goodsInfo = JSON.stringify(goodsInfo)
                let url = '../goods/goods'  // 之后如果需要别的路径，再行更改，目前默认写死
                // type:0 item,1 topic,2
                // state:0 上架 1 下架
                // let qcl = param['qcl_id']
                let qcl = 0
                sql = "insert into item(`name`,image,url,price,stock,`describe`,sort2,`limit`,`type`,integral_price,state,user_id,category_id_1,create_time,review_id,goods_info,label)values(?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?,?)";
                row = await db.Query(sql, [param['goods_title'], goodsImg, url, param['price'], param['stock'], param['goods_desc'], param['goods_sort2'], param['goods_limit'], param['type'], param['integralValue'], param['state'], param['user_id'], param['category_id_select'], 0, goodsInfo, label]);

                if (row.insertId) {
                    data.text = '添加成功'
                }
                // item 添加完成
                // if (row.insertId) {
                //     let item_id = row.insertId
                //     let insert_param_list = []
                //     for (let i in param['paramItem']) {
                //         if (param['paramItem'][i].haveParamImg) {
                //             param['paramItem'][i].size = param['paramItem'][i].size.map(function (f) {
                //                 f.img = qiniuRootUrl + f.img[0]
                //                 return f
                //             })
                //         } else {
                //             param['paramItem'][i].size = param['paramItem'][i].size.map(function (f) {
                //                 f.img = ''
                //                 return f
                //             })
                //         }
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
                //                 data.text = '添加成功'
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

module.exports = shopAddGoods;