var yinbaoVM = new Vue({
    el: '#yinbao',
    data: {
        // start_time: '',
        // end_time: '',

        year: 2019,
        month: 9,
        dayList: [],
        number: 0,

        accessTimesData: null,

        isPhone: false
    },
    methods: {
        yinbaoGetGoodsToUpdate: function () {
            //显示
            $('#myModal').modal('show');
            const url = '../api/yinbao_update_data', async = true
            let data = {}
            server(url, data, async, "post", function (res) {
                console.info(res)
                if (res.code == 1) {
                    //影藏
                    $('#myModal').modal('hide');
                    alert('更新brunch小程序菜单成功')
                }
            })
        },
        updateRefund: function (day, refund) {
            console.info(refund)
            let time = this.year + '-' + this.month + '-' + day
            console.info(time)

            const url = '../api/yinbao_record_refund', async = true
            let data = {}
            data.refund = refund
            data.time = time
            server(url, data, async, "post", function (res) {
                // console.info(res)
            })
        },
        yinbaoGetAPIAccessTimes: function () {
            let self = this
            const url = '../api/yinbao_get_API_access_times', async = true
            let data = {}
            server(url, data, async, "post", function (res) {
                console.info(res)
                if (res.code == 1) {
                    self.accessTimesData = res.data
                }
            })
        }
    }
})

$(document).ready(function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        // 执行相应代码或直接跳转到手机页面
        yinbaoVM.isPhone = true
    } else {
        // 执行桌面端代码
        yinbaoVM.isPhone = false
    }

    getDate(0)
})

laydate.render({
    elem: '#test5_1'
    , type: 'datetime'
    , calendar: true
});

laydate.render({
    elem: '#test5_2'
    , type: 'datetime'
    , calendar: true
});

function getDate(n) {
    yinbaoVM.dayList = []
    //必要的数据
    //今天的年 月 日 ；本月的总天数；本月第一天是周几？？？
    // var iNow = 0;

    var oDate = new Date(); //定义时间
    oDate.setMonth(oDate.getMonth() + n);//设置月份
    var year = oDate.getFullYear(); //年
    var month = oDate.getMonth(); //月
    var today = oDate.getDate(); //日

    //计算本月有多少天
    let allDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    //判断闰年
    if (month == 1) {
        if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
            allDay = 29;
        }
    }

    yinbaoVM.year = year
    yinbaoVM.month = month + 1
    for (let i = 1; i <= allDay; i++) {
        yinbaoVM.dayList.push({
            day: i,
            refund: 0,
            time: new Date(year + '-' + Number(month + 1) + '-' + i)
        })
    }
    // let number = Number(allDay / 7).toFixed(0)
    // yinbaoVM.number = (allDay % 7 >= 5 ? number : Number(number) + 1)
    // yinbaoVM.n = n
    if(!yinbaoVM.isPhone){
        let number = Number(allDay / 7).toFixed(0)
        yinbaoVM.number = (allDay % 7 >= 5 ? number : Number(number) + 1)
        yinbaoVM.n = n
    }else{
        let number = Number(allDay / 3).toFixed(0)
        yinbaoVM.number = (allDay % 3 >= 11 ? number : Number(number) + 1)
        yinbaoVM.n = n
    }

    getYinbaoRefund(year, month + 1)
}

function getYinbaoRefund(year, month) {
    const url = '../api/yinbao_get_refund', async = true
    let data = {}
    data.start_time = year + '-' + month + '-1'
    data.end_time = year + '-' + Number(month + 1) + '-1'
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.length > 0) {
            for (let i in res) {
                for (let j in yinbaoVM.dayList) {
                    if (new Date(res[i].time).getTime() == yinbaoVM.dayList[j].time.getTime()) {
                        yinbaoVM.dayList[j].refund = res[i].total_refund
                        break
                    }
                }
            }

        }
    })
}

// $(function () {
//
//     //必要的数据
//     //今天的年 月 日 ；本月的总天数；本月第一天是周几？？？
//     var iNow = 0;
//
//     function run(n) {
//
//         var oDate = new Date(); //定义时间
//         oDate.setMonth(oDate.getMonth() + n);//设置月份
//         var year = oDate.getFullYear(); //年
//         var month = oDate.getMonth(); //月
//         var today = oDate.getDate(); //日
//
//         //计算本月有多少天
//         var allDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
//
//         //判断闰年
//         if (month == 1) {
//             if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
//                 allDay = 29;
//             }
//         }
//
//         //判断本月第一天是星期几
//         oDate.setDate(1); //时间调整到本月第一天
//         var week = oDate.getDay(); //读取本月第一天是星期几
//
//         //console.log(week);
//         $(".dateList").empty();//每次清空
//         //插入空白
//
//         for (var i = 0; i < week; i++) {
//             $(".dateList").append("<li></li>");
//         }
//
//         //日期插入到dateList
//         for (var i = 1; i <= allDay; i++) {
//             $(".dateList").append("<li>" + i + "</li>")
//         }
//         //标记颜色=====================
//         $(".dateList li").each(function (i, elm) {
//             //console.log(index,elm);
//             var val = $(this).text();
//             //console.log(val);
//             if (n == 0) {
//                 if (val < today) {
//                     $(this).addClass('ccc')
//                 } else if (val == today) {
//                     $(this).addClass('red')
//                 } else if (i % 7 == 0 || i % 7 == 6) {
//                     $(this).addClass('sun')
//                 }
//             } else if (n < 0) {
//                 $(this).addClass('ccc')
//             } else if (i % 7 == 0 || i % 7 == 6) {
//                 $(this).addClass('sun')
//             }
//         });
//
//         //定义标题日期
//         $("#calendar h4").text(year + "年" + (month + 1) + "月");
//     };
//     run(0);
//
//     $(".a1").click(function () {
//         iNow--;
//         run(iNow);
//     });
//
//     $(".a2").click(function () {
//         iNow++;
//         run(iNow);
//     })
// });