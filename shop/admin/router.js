function Router() {
    this.Service = function (data, url, callback) {
        var baseApi = {};
        var arr = url.split("/");
        var version = arr[1];
        var apiFunction = arr[2];

        switch (apiFunction) {
            case "get_menu":
                var getMenu = require("./api/get_menu.js");
                baseApi = new getMenu;
                break;
            case "order":
                var order = require("./api/get_order.js");
                baseApi = new order;
                break;
            case "get_order_by_search":
                var getOrderBySearch = require("./api/get_order_by_search.js");
                baseApi = new getOrderBySearch;
                break;
            case "order_detail":
                var orderDetail = require("./api/get_order_detail.js");
                baseApi = new orderDetail;
                break;
            case "get_logistics":
                var shopGetLogistics = require("./api/shop_get_logistics.js");
                baseApi = new shopGetLogistics;
                break;
            case "refund":
                var shopRefund = require("./api/shop_refund.js");
                baseApi = new shopRefund;
                break;
            case "rejectRefund":
                var shopRejectRefund = require("./api/shop_rejectRefund.js");
                baseApi = new shopRejectRefund;
                break;
            case "update_orderState":
                var shopUpdateOrderState = require("./api/shop_update_orderState.js");
                baseApi = new shopUpdateOrderState;
                break;
            case "update_orderAfterSaleState":
                var shopUpdateOrderAfterSaleState = require("./api/shop_update_orderAfterSaleState.js");
                baseApi = new shopUpdateOrderAfterSaleState;
                break;
            case "get_goods":
                var shopGetGoods = require("./api/shop_get_goods.js");
                baseApi = new shopGetGoods;
                break;
            case "get_goods_by_cate":
                var shopGetGoodsByCate = require("./api/shop_get_goods_by_cate.js");
                baseApi = new shopGetGoodsByCate;
                break;
            case "login":
                var shopLogin = require("./api/login.js");
                baseApi = new shopLogin;
                break;
            case "get_category":
                var shopGetCategory = require("./api/shop_get_category.js");
                baseApi = new shopGetCategory;
                break;
            case "add_category":
                var shopAddCategory = require("./api/shop_add_category.js");
                baseApi = new shopAddCategory;
                break;
            case "update_category_sort":
                var shopUpdateCategorySort = require("./api/shop_update_category_sort.js");
                baseApi = new shopUpdateCategorySort;
                break;
            case "update_category":
                var shopUpdateCategory = require("./api/shop_update_category.js");
                baseApi = new shopUpdateCategory;
                break;
            case "get_uploadToken":
                var shopGetUploadToken = require("./api/shop_getUploadToken.js");
                baseApi = new shopGetUploadToken;
                break;
            case "del_category":
                var shopDeleteCategory = require("./api/shop_delete_category.js");
                baseApi = new shopDeleteCategory;
                break;
            case "get_specification":
                var shopGetSpecification = require("./api/shop_get_specification.js");
                baseApi = new shopGetSpecification;
                break;
            case "add_specification":
                var shopAddSpecification = require("./api/shop_add_specification.js");
                baseApi = new shopAddSpecification;
                break;
            case "get_brand":
                var shopGetBrand = require("./api/shop_get_brand.js");
                baseApi = new shopGetBrand;
                break;
            case "add_goods":
                var shopAddGoods = require("./api/shop_add_goods.js");
                baseApi = new shopAddGoods;
                break;
            case "get_navigation":
                var shopGetNavigation = require("./api/shop_get_navigation.js");
                baseApi = new shopGetNavigation;
                break;
            case "update_navigation":
                var shopUpdateNavigation = require("./api/shop_update_navigation.js");
                baseApi = new shopUpdateNavigation;
                break;
            case "get_ad":
                var shopGetAd = require("./api/shop_get_ad.js");
                baseApi = new shopGetAd;
                break;
            case "add_ad":
                var shopAddAd = require("./api/shop_add_ad.js");
                baseApi = new shopAddAd;
                break;
            case "update_ad":
                var shopUpdateAd = require("./api/shop_update_ad.js");
                baseApi = new shopUpdateAd;
                break;
            case "update_adSort":
                var shopUpdateAdSort = require("./api/shop_update_adSort.js");
                baseApi = new shopUpdateAdSort;
                break;
            case "get_waterfall":
                var shopGetWaterfall = require("./api/shop_get_waterfall.js");
                baseApi = new shopGetWaterfall;
                break;
            case "update_waterfall":
                var shopUpdateWaterfall = require("./api/shop_update_waterfall.js");
                baseApi = new shopUpdateWaterfall;
                break;
            case "update_waterfallSort":
                var shopUpdateWaterfallSort = require("./api/shop_update_waterfallSort.js");
                baseApi = new shopUpdateWaterfallSort;
                break;
            case "get_goods_by_category":
                var shopGetGoodsByCategory = require("./api/shop_get_goods_by_category.js");
                baseApi = new shopGetGoodsByCategory;
                break;
            case "update_goodsState":
                var shopUpdateGoodsState = require("./api/shop_update_goodsState.js");
                baseApi = new shopUpdateGoodsState;
                break;
            case "get_param":
                var shopGetParam = require("./api/shop_get_param.js");
                baseApi = new shopGetParam;
                break;
            case "update_goods":
                var shopUpdateGoods = require("./api/shop_update_goods.js");
                baseApi = new shopUpdateGoods;
                break;
            case "get_public":
                var shopGetPublic = require("./api/shop_get_public.js");
                baseApi = new shopGetPublic;
                break;
            case "add_brand":
                var shopAddBrand = require("./api/shop_add_brand.js");
                baseApi = new shopAddBrand;
                break;
            case "update_brandState":
                var shopUpdateBrandState = require("./api/shop_update_brandState.js");
                baseApi = new shopUpdateBrandState;
                break;
            case "update_brand":
                var shopUpdateBrand = require("./api/shop_update_brand.js");
                baseApi = new shopUpdateBrand;
                break;
            case "get_waitShip":
                var shopGetWaitShip = require("./api/shop_get_waitShip.js");
                baseApi = new shopGetWaitShip;
                break;
            case "get_afterSaleNumber":
                var shopGetAfterSaleNumber = require("./api/shop_get_afterSaleNumber.js");
                baseApi = new shopGetAfterSaleNumber;
                break;
            case "get_sales":
                var shopGetSales = require("./api/shop_get_sales.js");
                baseApi = new shopGetSales;
                break;
            case "get_sales_balance":
                var shopGetSalesBalance = require("./api/shop_get_sales_balance.js");
                baseApi = new shopGetSalesBalance;
                break;
            case "get_people":
                var shopGetPeople = require("./api/shop_get_people.js");
                baseApi = new shopGetPeople;
                break;
            case "get_people_shop":
                var shopGetPeopleShop = require("./api/shop_get_people_shop.js");
                baseApi = new shopGetPeopleShop;
                break;
            case "get_orderAmount":
                var shopGetOrderAmount = require("./api/shop_get_orderAmount.js");
                baseApi = new shopGetOrderAmount;
                break;
            case "get_refundAmount":
                var shopGetRefundAmount = require("./api/shop_get_refundAmount.js");
                baseApi = new shopGetRefundAmount;
                break;
            case "update_adState":
                var shopUpdateAdState = require("./api/shop_update_adState.js");
                baseApi = new shopUpdateAdState;
                break;
            case "del_ad":
                var shopDeleteAd = require("./api/shop_delete_ad.js");
                baseApi = new shopDeleteAd;
                break;
            case "edit_ad":
                var shopUpdateAd = require("./api/shop_update_ad.js");
                baseApi = new shopUpdateAd;
                break;
            case "get_account":
                var shopGetAccount = require("./api/shop_get_account.js");
                baseApi = new shopGetAccount;
                break;
            case "get_position":
                var shopGetPosition = require("./api/shop_get_position.js");
                baseApi = new shopGetPosition;
                break;
            case "get_review":
                var shopGetReview = require("./api/shop_get_review.js");
                baseApi = new shopGetReview;
                break;
            case "update_review":
                var shopUpdateReview = require("./api/shop_update_review.js");
                baseApi = new shopUpdateReview;
                break;
            case "update_best_review":
                var shopUpdateBestReview = require("./api/shop_update_best_review.js");
                baseApi = new shopUpdateBestReview;
                break;
            case "del_review":
                var shopDelReview = require("./api/shop_delete_review.js");
                baseApi = new shopDelReview;
                break;
            case "add_position":
                var shopAddPosition = require("./api/shop_add_position.js");
                baseApi = new shopAddPosition;
                break;
            case "add_account":
                var shopAddAccount = require("./api/shop_add_account.js");
                baseApi = new shopAddAccount;
                break;
            case "update_account":
                var shopUpdateAccount = require("./api/shop_update_account.js");
                baseApi = new shopUpdateAccount;
                break;
            case "del_account":
                var shopDelAccount = require("./api/shop_delete_account.js");
                baseApi = new shopDelAccount;
                break;
            case "add_logistics_code_to_order":
                var shopAddLogisticsCodeToOrder = require("./api/shop_add_logistics_code_to_order.js");
                baseApi = new shopAddLogisticsCodeToOrder;
                break;
            case "get_user":
                var shopGetUser = require("./api/shop_get_user.js");
                baseApi = new shopGetUser;
                break;
            case "update_goods_category":
                var shopUpdateGoodsCategory = require("./api/shop_update_goods_category.js");
                baseApi = new shopUpdateGoodsCategory;
                break;
            case "update_goods_price":
                var shopUpdateGoodsPrice = require("./api/shop_update_goods_price.js");
                baseApi = new shopUpdateGoodsPrice;
                break;
            case "get_search_order":
                var shopGetSearchOrder = require("./api/shop_get_search_order.js");
                baseApi = new shopGetSearchOrder;
                break;
            case "update_integral":
                var shopUpdateIntegral = require("./api/shop_update_integral.js");
                baseApi = new shopUpdateIntegral;
                break;
            case "get_group":
                var shopGetGroup = require("./api/shop_get_group.js");
                baseApi = new shopGetGroup;
                break;
            case "update_groupState":
                var shopUpdateGroupState = require("./api/shop_update_groupState.js");
                baseApi = new shopUpdateGroupState;
                break;
            case "add_groupBuy":
                var shopAddGroupBuy = require("./api/shop_add_groupBuy.js");
                baseApi = new shopAddGroupBuy;
                break;
            case "get_goodsRefundUserList":
                var shopGetGoodsRefundUserList = require("./api/shop_get_goodsRefundUserList.js");
                baseApi = new shopGetGoodsRefundUserList;
                break;
            // case "yinbao_update_data":
            //     var yinbaoUpdateData = require("./api/yinbao_update_data.js");
            //     baseApi = new yinbaoUpdateData;
            //     break;
            // case "yinbao_record_refund":
            //     var yinbaoRecordRefund = require("./api/yinbao_record_refund.js");
            //     baseApi = new yinbaoRecordRefund;
            //     break;
            // case "yinbao_get_refund":
            //     var yinbaoGetRefund = require("./api/yinbao_get_refund.js");
            //     baseApi = new yinbaoGetRefund;
            //     break;
            // case "get_brunch_banner":
            //     var shopGetBrunchBanner = require("./api/shop_get_brunch_banner.js");
            //     baseApi = new shopGetBrunchBanner;
            //     break;
            // case "del_brunch_banner":
            //     var shopDelBrunchBanner = require("./api/shop_delete_brunch_banner.js");
            //     baseApi = new shopDelBrunchBanner;
            //     break;
            // case "update_brunch_banner_status":
            //     var shopUpdateBrunchBannerStatus = require("./api/shop_update_brunch_banner_status.js");
            //     baseApi = new shopUpdateBrunchBannerStatus;
            //     break;
            // case "get_brunch_category":
            //     var shopGetBrunchCategory = require("./api/shop_get_brunch_category.js");
            //     baseApi = new shopGetBrunchCategory;
            //     break;
            // case "get_goods_by_brunch_category":
            //     var shopGetGoodsByBrunchCategory = require("./api/shop_get_goods_by_brunch_category.js");
            //     baseApi = new shopGetGoodsByBrunchCategory;
            //     break;
            // case "add_brunch_banner":
            //     var shopAddBrunchBanner = require("./api/shop_add_brunch_banner.js");
            //     baseApi = new shopAddBrunchBanner;
            //     break;
            // case "update_brunch_banner_sort":
            //     var shopUpdateBrunchBannerSort = require("./api/shop_update_brunch_banner_sort.js");
            //     baseApi = new shopUpdateBrunchBannerSort;
            //     break;
            // case "yinbao_get_API_access_times":
            //     var YinbaoGetAPIAccessTimes = require("./api/yinbao_get_API_access_times.js");
            //     baseApi = new YinbaoGetAPIAccessTimes;
            //     break;
            // case "restaurant_get_order_by_time":
            //     var restaurantGetOrderByTime = require("./api/restaurant_get_order_by_time.js");
            //     baseApi = new restaurantGetOrderByTime;
            //     break;
            // case "yinbao_get_today_order":
            //     var yinbaoGetTodayOrder = require("./api/yinbao_get_today_order.js");
            //     baseApi = new yinbaoGetTodayOrder;
            //     break;
            // case "restaurant_get_today_order":
            //     var restaurantGetTodayOrder = require("./api/restaurant_get_today_order.js");
            //     baseApi = new restaurantGetTodayOrder;
            //     break;
            case "update_remind_time":
                var shopUpdateRemindTime = require("./api/shop_update_remind_time.js");
                baseApi = new shopUpdateRemindTime;
                break;
            case "get_store":
                var shopGetStore = require("./api/shop_get_store.js");
                baseApi = new shopGetStore;
                break;
            case "add_store":
                var shopAddStore = require("./api/shop_add_store.js");
                baseApi = new shopAddStore;
                break;
            case "update_store":
                var shopUpdateStore = require("./api/shop_update_store.js");
                baseApi = new shopUpdateStore;
                break;
            case "del_store":
                var shopDelStore = require("./api/shop_del_store.js");
                baseApi = new shopDelStore;
                break;
            case "add_panicBuyingTime":
                var shopAddPanicBuyingTime = require("./api/shop_add_panicBuyingTime.js");
                baseApi = new shopAddPanicBuyingTime;
                break;
            case "get_panicBuyingTime":
                var shopGetPanicBuyingTime = require("./api/shop_get_panicBuyingTime.js");
                baseApi = new shopGetPanicBuyingTime;
                break;
            case "update_panicBuyingTime":
                var shopUpdatePanicBuyingTime = require("./api/shop_update_panicBuyingTime.js");
                baseApi = new shopUpdatePanicBuyingTime;
                break;
            case "del_panicBuyingTime":
                var shopDeletePanicBuyingTime = require("./api/shop_delete_panicBuyingTime.js");
                baseApi = new shopDeletePanicBuyingTime;
                break;
            case "get_panicBuying":
                var shopGetPanicBuying = require("./api/shop_get_panicBuying.js");
                baseApi = new shopGetPanicBuying;
                break;
            case "add_panicBuying":
                var shopAddPanicBuying = require("./api/shop_add_panicBuying.js");
                baseApi = new shopAddPanicBuying;
                break;
            case "update_panicBuying":
                var shopUpdatePanicBuying = require("./api/shop_update_panicBuying.js");
                baseApi = new shopUpdatePanicBuying;
                break;
            case "add_card":
                var shopAddCard = require("./api/shop_add_card.js");
                baseApi = new shopAddCard;
                break;
            case "get_card":
                var shopGetCard = require("./api/shop_get_card.js");
                baseApi = new shopGetCard;
                break;
            case "get_delivery_order":
                var shopGetDeliveryOrder = require("./api/shop_get_delivery_order.js");
                baseApi = new shopGetDeliveryOrder;
                break;
            case "update_order_state_by_trade_id":
                var shopUpdateOrderStateByTradeId = require("./api/shop_update_order_state_by_trade_id.js");
                baseApi = new shopUpdateOrderStateByTradeId;
                break;
            case "update_card_info":
                var shopUpdateCardInfo = require("./api/shop_update_card_info.js");
                baseApi = new shopUpdateCardInfo;
                break;
            case "del_panicBuying":
                var shopDelPanicBuying = require("./api/shop_del_panicBuying.js");
                baseApi = new shopDelPanicBuying;
                break;
            case "get_goods_by_search":
                var shopGetGoodsBySearch = require("./api/shop_get_goods_by_search.js");
                baseApi = new shopGetGoodsBySearch;
                break;
            case "update_goods_value":
                var shopUpdateGoodsValue = require("./api/shop_update_goodsValue.js");
                baseApi = new shopUpdateGoodsValue;
                break;
            case "get_user_by_search":
                var shopGetUserBySearch = require("./api/shop_get_User_by_search.js");
                baseApi = new shopGetUserBySearch;
                break;
            case "get_panic_buying_by_search":
                var shopGetPanicBuyingBySearch = require("./api/shop_get_panicBuyingBySearch.js");
                baseApi = new shopGetPanicBuyingBySearch;
                break;
            case "get_waterfall_by_search":
                var shopGetWaterfallBySearch = require("./api/shop_get_waterfall_by_search.js");
                baseApi = new shopGetWaterfallBySearch;
                break;
            default:
                callback({code: 4, data: {}, error: "api错误"});
                return;
        }

        return baseApi.Service(version, data, callback);
    }
}

module.exports = Router;