var tools = require("./tool")

function FBRouter() {
    var tool = new tools;
    this.Run = function (path, param, res) {
        var arr = path.split("/");
        if (arr.length < 3) {
            tool.MakeResponse(200, {res: tool.error.ErrorPath, data: {}}, res);
            tool.log.warn("FBRouter::Run", "path is error");
        } else {
            var work = null;
            switch (arr[2]) {
                case "queue": {
                    var queue = require("./apis/queue");
                    work = new queue;
                    break;
                }
                case "queue_update_time_by_token": {
                    var queueUpdateTimeByToken = require("./apis/queue_update_time_by_token");
                    work = new queueUpdateTimeByToken;
                    break;
                }
                case "get_openid": {
                    var SHOPGetOpenId = require("./apis/shop_get_openid");
                    work = new SHOPGetOpenId;
                    break;
                }
                case "register": {
                    var SHOPRegister = require("./apis/shop_register");
                    work = new SHOPRegister;
                    break;
                }
                case "login": {
                    var SHOPLogin = require("./apis/shop_login");
                    work = new SHOPLogin;
                    break;
                }
                case "get_ad": {
                    var SHOPGetAd = require("./apis/shop_get_ad");
                    work = new SHOPGetAd;
                    break;
                }
                case "get_subCategory": {
                    var SHOPGetSubCategory = require("./apis/shop_get_subCategory");
                    work = new SHOPGetSubCategory;
                    break;
                }
                case "get_brand": {
                    var SHOPGetBrand = require("./apis/shop_get_brand");
                    work = new SHOPGetBrand;
                    break;
                }
                case "get_waterfall": {
                    var SHOPGetWaterfall = require("./apis/shop_get_waterfall");
                    work = new SHOPGetWaterfall;
                    break;
                }
                case "get_category": {
                    var SHOPGetCategory = require("./apis/shop_get_category");
                    work = new SHOPGetCategory;
                    break;
                }
                case "get_goodsList": {
                    var SHOPGetGoodsList = require("./apis/shop_get_goodsList");
                    work = new SHOPGetGoodsList;
                    break;
                }
                case "get_goodsInfo": {
                    var SHOPGetGoodsInfo = require("./apis/shop_get_goodsInfo");
                    work = new SHOPGetGoodsInfo;
                    break;
                }
                case "get_price": {
                    var SHOPGetPrice = require("./apis/shop_get_price");
                    work = new SHOPGetPrice;
                    break;
                }
                case "add_cart": {
                    var SHOPAddCart = require("./apis/shop_add_cart");
                    work = new SHOPAddCart;
                    break;
                }
                case "get_cart": {
                    var SHOPGetCart = require("./apis/shop_get_cart");
                    work = new SHOPGetCart;
                    break;
                }
                case "del_cart": {
                    var SHOPDelCart = require("./apis/shop_del_cart");
                    work = new SHOPDelCart;
                    break;
                }
                case "update_cartGoodsNum": {
                    var SHOPUpdateCartGoodsNum = require("./apis/shop_update_cartGoodsNum");
                    work = new SHOPUpdateCartGoodsNum;
                    break;
                }
                case "get_address": {
                    var SHOPGetAddress = require("./apis/shop_get_address");
                    work = new SHOPGetAddress;
                    break;
                }
                case "update_default_address": {
                    var SHOPUpdateDefaultAddress = require("./apis/shop_update_defaultAddress");
                    work = new SHOPUpdateDefaultAddress;
                    break;
                }
                case "add_address": {
                    var SHOPAddAddress = require("./apis/shop_add_address");
                    work = new SHOPAddAddress;
                    break;
                }
                case "del_address": {
                    var SHOPDelAddress = require("./apis/shop_del_address");
                    work = new SHOPDelAddress;
                    break;
                }
                case "update_address": {
                    var SHOPUpdateAddress = require("./apis/shop_update_address");
                    work = new SHOPUpdateAddress;
                    break;
                }
                case "get_check_order_stock": {
                    var SHOPGetCheckOrderStock = require("./apis/shop_get_check_order_stock");
                    work = new SHOPGetCheckOrderStock;
                    break;
                }
                case "add_submitOrder": {
                    var SHOPAddSubmitOrder = require("./apis/shop_add_submitOrder");
                    work = new SHOPAddSubmitOrder;
                    break;
                }
                case "payfee": {
                    var SHOPPayfee = require("./apis/shop_payfee");
                    work = new SHOPPayfee;
                    break;
                }
                case "payfee_continue": {
                    var SHOPPayfeeContinue = require("./apis/shop_payfee_continue");
                    work = new SHOPPayfeeContinue;
                    break;
                }
                case "get_order": {
                    var SHOPGetOrder = require("./apis/shop_get_order");
                    work = new SHOPGetOrder;
                    break;
                }
                case "update_orderState": {
                    var SHOPUpdateOrderState = require("./apis/shop_update_orderState");
                    work = new SHOPUpdateOrderState;
                    break;
                }
                case "add_review": {
                    var SHOPAddReview = require("./apis/shop_add_review");
                    work = new SHOPAddReview;
                    break;
                }
                case "get_review": {
                    var SHOPGetReview = require("./apis/shop_get_review");
                    work = new SHOPGetReview;
                    break;
                }
                case "get_uploadToken": {
                    var SHOPGetUploadToken = require("./apis/shop_get_UploadToken");
                    work = new SHOPGetUploadToken;
                    break;
                }
                case "get_afterSale": {
                    var SHOPGetAfterSale = require("./apis/shop_get_afterSale");
                    work = new SHOPGetAfterSale;
                    break;
                }
                case "add_afterSale": {
                    var SHOPAddAfterSale = require("./apis/shop_add_afterSale");
                    work = new SHOPAddAfterSale;
                    break;
                }
                case "update_afterSaleState": {
                    var SHOPUpdateAfterSaleState = require("./apis/shop_update_afterSaleState");
                    work = new SHOPUpdateAfterSaleState;
                    break;
                }
                case "get_afterSaleNotice": {
                    var SHOPGetAfterSaleNotice = require("./apis/shop_get_afterSaleNotice");
                    work = new SHOPGetAfterSaleNotice;
                    break;
                }
                case "get_logistics": {
                    var SHOPGetLogistics = require("./apis/shop_get_logistics");
                    work = new SHOPGetLogistics;
                    break;
                }
                case "get_integral": {
                    var SHOPGetIntegral = require("./apis/shop_get_integral");
                    work = new SHOPGetIntegral;
                    break;
                }
                case "update_integral": {
                    var SHOPUpdateIntegral = require("./apis/shop_update_integral");
                    work = new SHOPUpdateIntegral;
                    break;
                }
                case "get_wxacodeunlimit": {
                    var SHOPGetWxacodeunlimit = require("./apis/shop_get_wxacodeunlimit");
                    work = new SHOPGetWxacodeunlimit;
                    break;
                }
                case "get_user_phone": {
                    var SHOPGetUserPhone = require("./apis/shop_get_user_phone");
                    work = new SHOPGetUserPhone;
                    break;
                }
                case "update_customer": {
                    var SHOPUpdateCustomer = require("./apis/shop_update_customer");
                    work = new SHOPUpdateCustomer;
                    break;
                }
                case "get_store": {
                    var SHOPGetStore = require("./apis/shop_get_store");
                    work = new SHOPGetStore;
                    break;
                }
                case "get_coupon_card": {
                    var CCSGetCouponCard = require("./apis/ccs_get_coupon_card");
                    work = new CCSGetCouponCard;
                    break;
                }
                case "add_card": {
                    var SHOPAddCard = require("./apis/shop_add_card");
                    work = new SHOPAddCard;
                    break;
                }
                case "get_card": {
                    var SHOPGetCard = require("./apis/shop_get_card");
                    work = new SHOPGetCard;
                    break;
                }
                case "get_order_group_trade_id": {
                    var SHOPGetOrderGroupTradeId = require("./apis/shop_get_order_group_trade_id");
                    work = new SHOPGetOrderGroupTradeId;
                    break;
                }
                case "get_panic": {
                    var SHOPGetPanic = require("./apis/shop_get_panic");
                    work = new SHOPGetPanic;
                    break;
                }
                case "check_new_customer": {
                    var SHOPCheckNewCustomer = require("./apis/shop_check_new_customer");
                    work = new SHOPCheckNewCustomer;
                    break;
                }
                case "check_consumption_to_get_card": {
                    var SHOPCheckConsumptionToGetCard = require("./apis/shop_check_consumption_to_get_card");
                    work = new SHOPCheckConsumptionToGetCard;
                    break;
                }
                case "balance_yly_print_order": {
                    var SHOPBalanceYLYPrintOrder = require("./apis/shop_balance_yly_print_order");
                    work = new SHOPBalanceYLYPrintOrder;
                    break;
                }
                case "get_activity_goods_by_id": {
                    var SHOPGetActivityGoodsById = require("./apis/shop_get_activity_goods_by_id");
                    work = new SHOPGetActivityGoodsById
                    break;
                }
                case "get_catalog": {
                    var SHOPGetCatalog = require("./apis/shop_get_catalog");
                    work = new SHOPGetCatalog
                    break;
                }
                case "be_share": {
                    var SHOPBeShare = require("./apis/shop_be_share");
                    work = new SHOPBeShare
                    break;
                }
                case "card_watcher": {
                    var SHOPCardWatcher = require("./apis/shop_card_watcher");
                    work = new SHOPCardWatcher
                    break;
                }
                default:
                    break;
            }
            if (work) {
                work.Run(arr[1], param, res).then(function (obj) {
                    res.end();
                    // tool.log.info("FBRouter::Run.out");
                });
            } else {
                tool.MakeResponse(200, {res: tool.error.ErrorBranch, data: {}}, res);
                res.end();
            }
        }
    }
}

module.exports = FBRouter;
