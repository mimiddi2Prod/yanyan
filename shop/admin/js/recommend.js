var recommendVM = new Vue({
    el: '#recommend',
    data: {
        recoList: [],
        navList: ['弹窗型', '轮播型'],
        navId: 0,
        last_id: 0,

        delId: '',

        pageList: [], // 分页栏
    },
    methods: {
        // 跳转添加推荐位需要
        // changePage: function (e, ad_id) {
        //     let temp = this.recoList.filter(function (res) {
        //         return res.id == ad_id
        //     })
        //     sessionStorage.setItem("editRecoList", JSON.stringify(temp));
        //
        //     var href = './' + e + '.html'
        //     $("#container").load(href);
        //     sessionStorage.setItem("href", href);
        // },
        editRecommend: function (ad_id) {
            let temp = this.recoList.filter(function (res) {
                return res.id == ad_id
            })
            sessionStorage.setItem("editRecoList", JSON.stringify(temp));
        },
        // 广告类型右箭头点击方向改变
        // changeCaret:function(id){
        // 	var collapseId = '#collapse' + id
        // 	var collapseContainer = '#collapse-container' + id
        // 	if($(collapseId)[0].className == "caret-right"){
        // 		$(collapseId).removeClass('caret-right')
        // 		$(collapseId).addClass('caret')
        //
        // 		$(collapseContainer).removeClass('none')
        // 	}else{
        // 		$(collapseId).removeClass('caret')
        // 		$(collapseId).addClass('caret-right')
        //
        // 		$(collapseContainer).addClass('none')
        // 	}
        // },
        // 删除按钮弹窗
        delItem: function (id, text) {
            $('#myModal').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('.modal-title').text('删除')
                modal.find('.modal-body span').text('是否删除 "' + text + '" 删除后不可恢复')
            })
            this.delId = id
        },
        // 状态按钮
        changeStatus: function (id, state) {
            if (state == 0) {
                state = 1
            } else if (state == 1) {
                state = 0
            }
            updateAdState(id, state)
        },
        getPage: function (index) {
            this.last_id = index
            getAd()
        },
        changeNav: function (index) {
            this.navId = index
            this.last_id = 0
            getAd()
        },

        updateSort: function (id, sort) {
            updateAd(id, sort)
        }
    }
})

$(document).ready(function () {
    getAd()
})

function getAd() {
    recommendVM.pageList = []
    recommendVM.recoList = []
    const url = api.getAd, async = true
    let data = {}
    data.last_id = recommendVM.last_id
    data.type = recommendVM.navId
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.number > 0) {
            res.recoList.map(function (fn) {
                fn.create_time = formatTime(new Date(fn.create_time))
                return fn
            })
            recommendVM.recoList = res.recoList

            // 分页栏
            for (let i = 0; i < res.number / 5; i++) {
                recommendVM.pageList.push(i + 1)
            }
        }
    })
}

function updateAdState(ad_id, state) {
    const url = api.updateAdState, async = true
    let data = {}
    data.ad_id = ad_id
    data.state = state
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res == "更新广告状态成功") {
            getAd()
        }
    })
}

function delAd() {
    const url = api.delAd, async = true
    let data = {}
    data.ad_id = recommendVM.delId
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.text == "删除成功") {
            $('#myModal').modal('hide')
            getAd()
        }
    })
}

function updateAd(id, sort) {
    const url = api.updateAdSort, async = true
    let data = {}
    data.id = id
    data.sort = sort
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.code == 0) {
            getAd()
        }
    })
}