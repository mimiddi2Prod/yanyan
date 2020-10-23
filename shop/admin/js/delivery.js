var deliveryVM = new Vue({
    el: '#delivery',
    data: {
        // orderAmount: 0.00, // 总金额不包括今日
        // a:false,
        //
        // total: [],
        // // list: [],
        isPhone: false,
        //
        // total_price: 0,

        order: []
    },
    methods: {
        changeOrderState: function (tradeId) {
            console.info(tradeId)
            const url = api.updateOrderStateByTradeId, async = true
            let data = {}
            data.tradeId = tradeId
            server(url, data, async, "post", function (res) {
                console.info(res)
                // deliveryVM.order = res.order
                if (res == "更新订单成功") {
                    alert('已送达')
                    window.location.reload()
                } else {
                    alert('确认失败，请联系技术人员')
                }
            })
        }
        // yinbaoGetTodayOrder: function () {
        //     let n = 0
        //     //必要的数据
        //     //今天的年 月 日 ；本月的总天数；本月第一天是周几？？？
        //     var oDate = new Date(); //定义时间
        //     oDate.setMonth(oDate.getMonth() + n);//设置月份
        //     var oyear = oDate.getFullYear(); //年
        //     var omonth = oDate.getMonth(); //月
        //     var otoday = oDate.getDate(); //日
        //
        //     deliveryVM.year = oyear
        //     deliveryVM.month = omonth + 1
        //
        //     var eDate = new Date(oDate.getTime() + (24 * 60 * 60 * 1000))
        //     var eyear = eDate.getFullYear(); //年
        //     var emonth = eDate.getMonth(); //月
        //     var etoday = eDate.getDate(); //日
        //
        //     let end_time = eyear + '-' + (emonth + 1) + '-' + etoday + ' 00:00:00'
        //     let start_time = oyear + '-' + (omonth + 1) + '-' + otoday + ' 00:00:00'
        //     console.info(end_time)
        //     console.info(start_time)
        //     getToday(start_time, end_time)
        // }
    }
})

$(document).ready(function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        // 执行相应代码或直接跳转到手机页面
        deliveryVM.isPhone = true
    } else {
        // 执行桌面端代码
        deliveryVM.isPhone = false
    }
    let a = sessionStorage.getItem('user_id')
    // if(a == 14 || a == 15){
    //     deliveryVM.a = true
    //     getOrderAmount()
    // }

    getOrder()
})

function getOrder() {
    const url = api.getDeliveryOrder, async = true
    let data = {}
    server(url, data, async, "post", function (res) {
        console.info(res)
        deliveryVM.order = res.order
    })
}

// function getToday(start_time, end_time) {
//     const url = api.yinbaoGetTodayOrder, async = true
//     let data = {}
//     data.start_time = start_time
//     data.end_time = end_time
//     server(url, data, async, "post", function (res) {
//         // console.info(res)
//         if (res.code == 0) {
//             getOrder()
//         }
//     })
// }

// function getOrder() {
//     deliveryVM.total_price = 0
//     deliveryVM.total = []
//     const url = api.restaurantGetTodayOrder, async = true
//     let data = {}
//     server(url, data, async, "post", function (res) {
//         deliveryVM.total_price = res.sellprice
//         if (res.list.length > 0) {
//             res.list = res.list.map(function (eData) {
//                 eData.items = JSON.parse(eData.items)
//                 eData.payments = JSON.parse(eData.payments)[0]
//                 eData.datetime = formatTime(new Date(eData.datetime))
//                 return eData
//             })
//             deliveryVM.total = res.list
//         }
//
//     })
// }

// function getOrderAmount() {
//     const url = api.getOrderAmount, async = true
//     let data = {}
//     server(url, data, async, "post", function (res) {
//         // console.info(res)
//         deliveryVM.orderAmount = res.number
//     })
// }