var brandVM = new Vue({
    el: '#brand',
    data: {
        brandList: [],
        navList: ['启用项', '禁用项'],
        navId: 0,
        last_id: 0,

        pageList: [], // 分页栏
    },
    methods: {
        // 跳转添加推荐位需要
        // changePage: function (e, brand_id) {
        //     let temp = this.brandList.filter(function (res) {
        //         return res.id == brand_id
        //     })
        //     sessionStorage.setItem("editBrandList", JSON.stringify(temp));
        //
        //     var href = './' + e + '.html'
        //     $("#container").load(href);
        //     sessionStorage.setItem("href", href);
        // },
        editBrand: function (brand_id) {
            let temp = this.brandList.filter(function (res) {
                return res.id == brand_id
            })
            sessionStorage.setItem("editBrand", JSON.stringify(temp));
            window.location.href = "editBrand"
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
        delItem: function (index) {
            const body = this.brandList[index].text
            $('#myModal').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('.modal-title').text('删除')
                modal.find('.modal-body span').text('是否删除 "' + body + '" 删除后不可恢复')
            })
        },
        // 状态按钮
        changeStatus: function (index) {
            // console.info(index)
        },
        getPage: function (index) {
            this.last_id = index
            getBrand()
        },
        changeNav: function (index) {
            this.navId = index
            this.last_id = 0
            getBrand()
        },
        changeStatus: function (id, state) {
            // 0在首页展示 1不在首页展示
            let cstate = ''
            if (state == 0) {
                cstate = 1
            } else if (state == 1) {
                cstate = 0
            }
            changeBrandState(id, cstate)
        },
    }
})

$(document).ready(function () {
    getBrand()
})

function getBrand() {
    brandVM.pageList = []
    brandVM.brandList = []
    const url = api.getBrand, async = true
    let data = {}
    data.last_id = brandVM.last_id
    data.state = brandVM.navId
    // data.type = brandVM.navIdnavId
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.number > 0) {
            res.brandList.map(function (fn) {
                fn.create_time = formatTime(new Date(fn.create_time))
                return fn
            })
            brandVM.brandList = res.brandList

            // 分页栏
            for (let i = 0; i < res.number / 4; i++) {
                brandVM.pageList.push(i + 1)
            }
        }
    })
}

function changeBrandState(id, state) {
    const url = api.updateBrandState, async = true
    let data = {}
    data.id = id
    data.state = state
    server(url, data, async, "post", function (res) {
        if (res.text == '更改成功') {
            brandVM.last_id = 0
            getBrand()
        }
    })
}