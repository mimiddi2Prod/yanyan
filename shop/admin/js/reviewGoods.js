var reviewVM = new Vue({
    el: '#reviewGoods',
    data: {
        goodsInfo: {},
        reviewList: [],
        best_review: [],
        review_id: '',
        edit_text: '',
        del_review_id: '',

        last_id: 0,
        pageList: [], // 分页栏
    },
    methods: {
        // 删除按钮弹窗
        delReview: function (index) {
            console.info(index)
            const body = this.reviewList[index].text
            this.del_review_id = this.reviewList[index].id
            $('#myModal').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('.modal-title').text('删除')
                modal.find('.modal-body span').text('是否删除 "' + body + '" 删除后不可恢复')
            })
        },
        submitDelReview: function () {
            let self = this
            const url = api.delReview, async = true
            let data = {}
            // data.item_id = this.goodsInfo.item_id
            data.del_review_id = this.del_review_id
            data.best_review_id = this.goodsInfo.review_id
            data.item_id = this.goodsInfo.item_id
            server(url, data, async, "post", function (res) {
                console.info(res)
                if (res.text == '删除成功') {
                    sessionStorage.setItem('goods_review', JSON.stringify(res.goodsInfo))
                    self.goodsInfo = res.goodsInfo
                    getReview(self.goodsInfo.item_id, self.goodsInfo.review_id)
                    $('#myModal').modal('hide')
                }
            })
        },
        editReview: function (review_id, text) {
            this.review_id = review_id
            this.edit_text = text
        },
        updateReview: function () {
            let self = this
            if (!this.edit_text) {
                alert('评论为空')
                return
            }
            const url = api.updateReview, async = true
            let data = {}
            data.id = this.review_id
            data.text = encodeURIComponent(this.edit_text)
            server(url, data, async, "post", function (res) {
                if (res.text == '更改成功') {
                    self.review_id = ''
                    console.info(self.goodsInfo.item_id)
                    console.info(self.goodsInfo.review_id)
                    getReview(self.goodsInfo.item_id, self.goodsInfo.review_id)
                }
            })
        },
        cancleEditReview: function () {
            this.review_id = ''
        },
        bestReview: function (id) {
            let self = this
            const url = api.updateBestReview, async = true
            let data = {}
            data.id = id
            data.item_id = this.goodsInfo.item_id
            data.review_id = this.goodsInfo.review_id
            server(url, data, async, "post", function (res) {
                if (res.text == '更改成功') {
                    sessionStorage.setItem('goods_review', JSON.stringify(res.goodsInfo))
                    self.goodsInfo = res.goodsInfo
                    getReview(self.goodsInfo.item_id, self.goodsInfo.review_id)
                }
            })
        },
        getPage: function (index) {
            this.last_id = index
            if(this.goodsInfo){
                getReview(this.goodsInfo.item_id, this.goodsInfo.review_id)
            }else{
                getReview()
            }
        },
    }
})

$(document).ready(function () {
    reviewVM.goodsInfo = JSON.parse(sessionStorage.getItem('reviewGoods')) || null
    if (reviewVM.goodsInfo) {
        console.info(reviewVM.goodsInfo)
        getReview(reviewVM.goodsInfo.trade_id, reviewVM.goodsInfo.review_id)
    } else {
        getReview()
    }
})

function getReview(trade_id, review_id) {
    reviewVM.pageList = []
    reviewVM.reviewList = []
    reviewVM.best_review = []
    const url = api.getReview, async = true
    let data = {}
    data.last_id = reviewVM.last_id
    data.trade_id = trade_id || null
    // data.review_id = review_id
    server(url, data, async, "post", function (res) {
        console.info(res.reviewList[0].order)
        if (!res.reviewList && res.number > 0) {
            location.reload()
            return
        }
        if (res.number > 0) {
            // res.best_review.map(function (fn) {
            //     fn.create_time = formatTime(new Date(fn.create_time))
            //     fn.text = decodeURIComponent(fn.text)
            //     return fn
            // })
            res.reviewList.map(function (fn) {
                fn.create_time = formatTime(new Date(fn.create_time))
                fn.text = decodeURIComponent(fn.text)
                return fn
            })
            // reviewVM.best_review = res.best_review
            reviewVM.reviewList = res.reviewList
            // reviewVM.goodsInfo = res.goodsInfo

            // 分页栏
            for (let i = 0; i < res.number / 20; i++) {
                reviewVM.pageList.push(i + 1)
            }
        }
    })
}

// function changeBrandState(id, state) {
//     const url = '../api/update_brandState'
//     let data = {}
//     data.id = id
//     data.state = state
//     server(url, data, "post", function (res) {
//         if (res.text == '更改成功') {
//             reviewVM.last_id = 0
//             getBrand()
//         }
//     })
// }