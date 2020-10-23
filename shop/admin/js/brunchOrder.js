var brunchOrderVM = new Vue({
    el: '#brunchOrder',
    data: {
        total: [],
        // list: [],
        isPhone: false,

        total_price: 0,
    },
    methods: {
        // getOrderDetail: function (yinbao_order_no) {
        //
        // }
    }
})

$(document).ready(function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        // 执行相应代码或直接跳转到手机页面
        brunchOrderVM.isPhone = true
    } else {
        // 执行桌面端代码
        brunchOrderVM.isPhone = false
    }

    getDate(0)
})

function getDate(n) {
    //必要的数据
    //今天的年 月 日 ；本月的总天数；本月第一天是周几？？？
    var oDate = new Date(); //定义时间
    oDate.setMonth(oDate.getMonth() + n);//设置月份
    var year = oDate.getFullYear(); //年
    var month = oDate.getMonth(); //月
    var today = oDate.getDate(); //日

    //计算本月有多少天
    // let allDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    //判断闰年
    // if (month == 1) {
    //     if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
    //         allDay = 29;
    //     }
    // }

    brunchOrderVM.year = year
    brunchOrderVM.month = month + 1

    let end_time = year + '-' + (month + 1) + '-' + (today + 1)
    let start_time = year + '-' + (month + 1) + '-' + today
    getSales(start_time, end_time)
}

function getSales(start_time, end_time) {
    const url = api.restaurantGetOrderByTime, async = true
    let data = {}
    data.start_time = start_time
    data.end_time = end_time
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.code == 0) {
            brunchOrderVM.total = res.total.map(function (eData) {
                // 格式化时间
                eData.create_time = formatTime(new Date(eData.create_time))
                eData.totalNumber = eval(eData['group_concat(number)'].split(',').join('+'))
                // eData.totalPrice = eval(eData['group_concat(price)'].split(',').join('+'))
                eData.totalPrice = 0
                eData.list = []
                for (let i in res.list) {
                    if (eData.yinbao_order_no == res.list[i].yinbao_order_no) {
                        eData.list.push(res.list[i])
                        eData.totalPrice = eData.totalPrice + res.list[i].price * res.list[i].number
                    }
                }
                brunchOrderVM.total_price = brunchOrderVM.total_price + eData.totalPrice
                return eData
            })
            // brunchOrderVM.list = res.list
        }
    })
}