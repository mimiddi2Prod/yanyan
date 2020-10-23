var db = require("./../utils/dba");
var appId = require('./../config/yinbaoConfig').appId
var request = require('../utils/yinbaoRequest')
var jsonBigInt = require('json-bigint')({"storeAsString": true});


function yinbaoUpdateData() {
    this.Service = async function (version, param, callback) {
        var sql = ""
        var data = {}
        var row = []
        try {
            // 1.更新分类
            let postData = {
                "appId": appId,
            }
            let postDataJson = JSON.stringify(postData)
            let router = "queryProductCategoryPages"
            let e = await request(router, postDataJson)
            e = jsonBigInt.parse(e)
            console.info("获得分类数据：")

            let CategoryResult = ""
            let bigCateUid = '', littleCateUidList = [] // 分类获取商品信息需要
            if (e.status == "success" && e.data.result.length > 0) {
                CategoryResult = e.data.result
                // 先清除原有的数据
                sql = "delete from restaurant_category"
                row = await db.Query(sql)

                // 插入现有的银豹分类数据
                for (let i in CategoryResult) {
                    // CategoryResult[i].uid = CategoryResult[i].uid.c.join("")
                    // if (CategoryResult[i].parentUid != 0) {
                    //     CategoryResult[i].parentUid = CategoryResult[i].parentUid.c.join("")
                    // }
                    console.info(CategoryResult[i])
                    if (CategoryResult[i].name == "食品") {
                        bigCateUid = CategoryResult[i].uid
                    }
                    if (CategoryResult[i].parentUid != 0 && CategoryResult[i].parentUid == bigCateUid) {
                        littleCateUidList.push({
                            name: CategoryResult[i].name,
                            uid: CategoryResult[i].uid
                        })
                    }
                }
                for(let i in littleCateUidList){
                    sql = "insert into restaurant_category(`name`,id,location_code,create_time) values (?,?,?,current_timestamp )"
                    row = await db.Query(sql, [littleCateUidList[i].name, littleCateUidList[i].uid, "xmspw"])
                }
            }


            // 根据分类获取商品列表
            // 先清除原有的数据
            sql = "delete from restaurant_goods"
            row = await db.Query(sql)
            // 先清除原有的数据
            sql = "delete from restaurant_goods_sku"
            row = await db.Query(sql)
            for (let k in littleCateUidList) {
                // 2.更新商品列表
                let ProductResult = ""
                postData = {
                    "appId": appId,
                    "categoryUid": littleCateUidList[k].uid,
                }
                postDataJson = JSON.stringify(postData)
                router = "queryProductPages"
                e = await request(router, postDataJson)
                console.info("获得商品数据：")
                e = jsonBigInt.parse(e)

                if (e.status == "success" && e.data.result.length > 0) {
                    ProductResult = e.data.result
                    // // 先清除原有的数据
                    // sql = "delete from restaurant_goods"
                    // row = await db.Query(sql)
                    console.info(ProductResult)

                    // 插入现有的银豹商品数据（没有图片，需另外获取）
                    for (let i in ProductResult) {
                        // ProductResult[i].uid = ProductResult[i].uid.c.join("")
                        // ProductResult[i].categoryUid = ProductResult[i].categoryUid.c.join("")
                        let description = ''
                        if(ProductResult[i].description){
                            description = ProductResult[i].description
                        }
                        sql = "insert into restaurant_goods(`name`,id,`describe`,min_price,category_id,stock,status,location_code,create_time) values (?,?,?,?,?,?,?,?,current_timestamp )"
                        row = await db.Query(sql, [ProductResult[i].name, ProductResult[i].uid, description, ProductResult[i].sellPrice, ProductResult[i].categoryUid, ProductResult[i].stock, ProductResult[i].enable, "xmspw"])
                    }
                    console.info(ProductResult)

                    // 将备注里的数据格式 放到参数表上
                    // // 先清除原有的数据
                    // sql = "delete from restaurant_goods_sku"
                    // row = await db.Query(sql)

                    // 插入现有的银豹商品数据（没有图片，需另外获取）
                    for (let i in ProductResult) {
                        let tempList = (ProductResult[i].attribute2 ? ProductResult[i].attribute2 : '')
                        if (tempList.length > 0) {
                            tempList = JSON.parse(tempList)
                            if (typeof tempList == "object") {
                                let goods_id = ProductResult[i].uid
                                let stock = ProductResult[i].stock
                                let price = ProductResult[i].sellPrice
                                let len = tempList.length
                                if (len > 0) {
                                    let y = []
                                    for (let i = 0; i < len; i++) {
                                        y.push(tempList[i].text)
                                    }
                                    var models = y
                                    let paramGroup = digui(models)
                                    let temp = {}
                                    let list = []
                                    for (let i in paramGroup) {
                                        let arr = paramGroup[i].split(',')
                                        for (let j in arr) {
                                            let key = tempList[j].name
                                            let value = arr[j]
                                            temp[key] = value
                                        }
                                        list.push({
                                            param: JSON.stringify(temp)
                                        })
                                    }
                                    for (let j in list) {
                                        sql = "insert into restaurant_goods_sku(stock,price,goods_id,param,create_time,user_id)values(?,?,?,?,current_timestamp,?)"
                                        row = await db.Query(sql, [stock, price, goods_id, list[j].param, 0])
                                    }
                                    // console.info(this.table)
                                }
                            }

                        }

                    }
                }
            }


            // 2.更新商品列表图片
            // 银豹只会给有图片的信息
            // let ProductImgResult = ""
            // postData = {
            //     "appId": appId,
            // }
            // postDataJson = JSON.stringify(postData)
            // router = "queryProductImagePages"
            // e = await request(router, postDataJson)
            // console.info("获得商品图片数据：")
            // console.info(e)

            // e = jsonBigInt.parse(e)

            // if (e.status == "success" && e.data.result.length > 0) {
            //     ProductImgResult = e.data.result

            //     // 根据productUid更新商品图片
            //     for (let i in ProductImgResult) {
            //         sql = "update restaurant_goods set img = ? where id = ?"
            //         row = await db.Query(sql, [ProductImgResult[i].imageUrl, ProductImgResult[i].productUid])
            //     }
            // }
            postData = {
                "appId": appId,
            }
            await getYinBaoImg(postData)

            data.code = 1
            return callback(data);
        } catch (e) {
            console.info('boom!!!!!!!!!!!!!')
        }
    }
}

module.exports = yinbaoUpdateData;

function digui(models) {
    // var models = [['BMW X1', 'BMW X3', 'BMW X5', 'BMW X6'], ['RED', 'BLUE', 'GREEN'], ['低配', '中配', '高配'], ['进口', '国产']];
    var mLen = models.length;
    var index = 0;

    var digui = function (arr1, arr2) {
        // console.log("enter digui",arr1,arr2);
        var res = [];
        arr1.forEach(function (m) {
            arr2.forEach(function (n) {
                res.push(m + "," + n);
            })
        });
        index++;
        if (index <= mLen - 1) {
            return digui(res, models[index])
        } else {
            return res;
        }
    };
    var resultArr = [];
    if (mLen >= 2) {
        resultArr = digui(models[index], models[++index]);
    } else {
        resultArr = models[0];
    }
    console.log(resultArr);
    return resultArr
}

async function getYinBaoImg(postData){
    let ProductImgResult = ""
    
    postDataJson = JSON.stringify(postData)
    router = "queryProductImagePages"
    e = await request(router, postDataJson)
    console.info("获得商品图片数据：")
    console.info(e)

    e = jsonBigInt.parse(e)

    if (e.status == "success" && e.data.result.length > 0) {
        ProductImgResult = e.data.result

        // 根据productUid更新商品图片
        for (let i in ProductImgResult) {
            sql = "update restaurant_goods set img = ? where id = ?"
            row = await db.Query(sql, [ProductImgResult[i].imageUrl, ProductImgResult[i].productUid])
        }
    }
    if(e.data.result.length >= 100){
        postData.postBackParameter = e.data.postBackParameter
        await getYinBaoImg(postData)
    }
}