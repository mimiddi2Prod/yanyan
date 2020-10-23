var couponVM = new Vue({
    el: "#coupon",
    data: {
        last_id: 0,
        // navId: -1,
        pageList: [],
        cardList: [],
        // sortList: [{
        //     name: '居家',
        //     id: 0,
        //     order: 0,//0和1 ，0:上移，1:下移
        //     createTime: '2019-02-20',
        //     goodsNum: 19,
        //     menu: [{
        //         menu_name: '风扇',
        //         menu_order: 0,//0和1 ，0:上移，1:下移
        //         menu_createTime: '2019-02-20',
        //         menu_goodsNum: 19,
        //     }, {
        //         menu_name: '纸巾',
        //         menu_order: 0,//0和1 ，0:上移，1:下移
        //         menu_createTime: '2019-02-20',
        //         menu_goodsNum: 19,
        //     }]
        // }, {
        //     name: '服装',
        //     id: 1,
        //     order: 0,//0和1 ，0:上移，1:下移
        //     createTime: '2019-02-20',
        //     goodsNum: 191,
        //     menu: [{
        //         menu_name: '秋裤',
        //         menu_order: 0,//0和1 ，0:上移，1:下移
        //         menu_createTime: '2019-02-20',
        //         menu_goodsNum: 129,
        //     }]
        // }, {
        //     name: '志趣',
        //     id: 2,
        //     order: 0,//0和1 ，0:上移，1:下移
        //     createTime: '2019-02-20',
        //     goodsNum: 191,
        //     menu: []
        // }],
        index: '',
        // sortModalText: '',
        // sortModalSort: '',
        // // 大分类才有
        // sortModalDesc: '',
        // // 小分类才有
        // sortModalImg: [],
        // sortModalUrl: '',

        modalType: 0,  //0 添加分类 1删除分类
        delCategoryId: '',
        delCategoryParentId: '',

        editId: '',

        card_id: '',
    },
    methods: {
        // getPage: function (index) {
        //     this.last_id = index
        //     getCategory()
        // },
        addSort: function (index) {
            this.modalType = 0
            this.index = index
            if (index < 0) {
                $('#myModal').on('show.bs.modal', function () {
                    var modal = $(this)
                    modal.find('.modal-title').text('添加卡券')
                })
            }
            // else {
            //     const title = this.sortList[index].name
            //     $('#myModal').on('show.bs.modal', function () {
            //         var modal = $(this)
            //         modal.find('.modal-title').text('添加 "' + title + '" 分类')
            //     })
            // }
        },
        setType: function (id, type, is_del) {
            couponVM.cardList = []
            const url = api.updateCardInfo, async = true
            let data = {}
            data.id = id
            data.type = type
            data.is_del = is_del ? 1 : 0
            server(url, data, async, "post", function (res) {
                // console.info(res)
                if (res.text == '更新成功') {
                    alert(res.text)
                    window.location.reload()
                }
            })
        },
        delSort: function (parent_id, id, name) {
            this.modalType = 1
            this.delCategoryId = id
            this.delCategoryParentId = parent_id
            $('#myModal').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('.modal-title').text('删除 "' + name + '" 分类')
            })
        },
        // updateSort: function (id, sort) {
        //     updateCategorySort(id, sort)
        // },
        // EditSort: function (index, parent_id, id, name, sort, image, desc) {
        //     this.modalType = 2
        //     this.editId = id
        //     this.sortModalText = name
        //     this.sortModalSort = sort
        //     this.sortModalImg[0] = {
        //         key: image,
        //         tempFilePath: image
        //     }
        //     this.index = index
        //     if (parent_id == 0) {
        //         this.sortModalDesc = desc
        //     } else {
        //         this.sortModalUrl = desc
        //     }
        //
        //     $('#myModal').on('show.bs.modal', function () {
        //         var modal = $(this)
        //         modal.find('.modal-title').text('编辑 "' + name + '" 分类')
        //     })
        // },
        submitSortBtn: function () {
            if (this.modalType == 0 || this.modalType == 2) {
                addCard()
                // 添加分类
                // let type = 0, parent_id = 0
                // if (this.sortModalText == '') {
                //     alert('请填写分类名称')
                //     return
                // } else if (this.sortModalSort == '') {
                //     alert('请填写分类排序')
                //     return
                // } else if (this.sortModalImg == []) {
                //     alert('请选择上传图片')
                //     return
                // }
                // if (this.index < 0) {
                //     // 大分类
                //     if (this.sortModalDesc == '') {
                //         alert('请填写分类描述')
                //         return
                //     }
                //     type = 0, parent_id = 0
                // } else {
                //     // 小分类
                //     if (this.sortModalUrl == '') {
                //         alert('请选择分类路径')
                //         return
                //     }
                //     type = 1, parent_id = this.sortList[this.index].id
                // }
                // let self = this, flag = 0
                // for (let i in this.sortModalImg) {
                //     if (this.sortModalImg[i].uploadToken) {
                //         uploadImg(this.sortModalImg[i].key, this.sortModalImg[i].uploadToken, this.sortModalImg[i].imgFile, function (res) {
                //             // flag 图片上传完毕之后才提交
                //             flag++
                //             if (flag == self.sortModalImg.length) {
                //                 // console.info('上传完毕')
                //                 if (self.modalType == 0) {
                //                     addCategory(type, parent_id)
                //                 } else if (self.modalType == 2) {
                //                     updateCategory(type, parent_id)
                //                 }
                //             }
                //         })
                //     } else {
                //         flag++
                //         if (flag == self.sortModalImg.length) {
                //             if (self.modalType == 2) {
                //                 updateCategory(type, parent_id)
                //             }
                //         }
                //     }
                // }
            } else if (this.modalType == 1) {
                // 删除分类
                delCategory(this.delCategoryParentId, this.delCategoryId)
            }

            $('#myModal').modal('hide')
        }
    }
})

$(document).ready(function () {
    // getCategory()
    getCard()
})

function getCard() {
    // categoryVM.pageList = []
    couponVM.cardList = []
    const url = api.getCard, async = true
    let data = {}
    // data.last_id = categoryVM.last_id
    server(url, data, async, "post", function (res) {
        console.info(res)
        if (res.number > 0) {
            res.cardList.map(function (fn) {
                fn.create_time = formatTime(new Date(fn.create_time))
                fn.cash = JSON.parse(fn.cash)
                if (fn.cash.base_info.date_info.type == 'DATE_TYPE_FIX_TIME_RANGE') {
                    fn.cash.base_info.date_info.begin_timestamp = formatTime(new Date(fn.cash.base_info.date_info.begin_timestamp * 1000))
                    fn.cash.base_info.date_info.end_timestamp = formatTime(new Date(fn.cash.base_info.date_info.end_timestamp * 1000))
                }
                return fn
            })
            couponVM.cardList = res.cardList
            // console.info(res.cardList)
            // 分页栏
            // for (let i = 0; i < res.number / 5; i++) {
            //     categoryVM.pageList.push(i + 1)
            // }
        }
    })
}

function addCard() {
    const url = api.addCard, async = true
    let data = {}
    data.card_id = couponVM.card_id
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.code) {
            alert(res.text)
            window.location.reload()
        }
    })
}
