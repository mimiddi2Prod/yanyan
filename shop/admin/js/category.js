var categoryVM = new Vue({
    el: "#category",
    data: {
        last_id: 0,
        // navId: -1,
        pageList: [],
        sortList: [{
            name: '居家',
            id: 0,
            order: 0,//0和1 ，0:上移，1:下移
            createTime: '2019-02-20',
            goodsNum: 19,
            menu: [{
                menu_name: '风扇',
                menu_order: 0,//0和1 ，0:上移，1:下移
                menu_createTime: '2019-02-20',
                menu_goodsNum: 19,
            }, {
                menu_name: '纸巾',
                menu_order: 0,//0和1 ，0:上移，1:下移
                menu_createTime: '2019-02-20',
                menu_goodsNum: 19,
            }]
        }, {
            name: '服装',
            id: 1,
            order: 0,//0和1 ，0:上移，1:下移
            createTime: '2019-02-20',
            goodsNum: 191,
            menu: [{
                menu_name: '秋裤',
                menu_order: 0,//0和1 ，0:上移，1:下移
                menu_createTime: '2019-02-20',
                menu_goodsNum: 129,
            }]
        }, {
            name: '志趣',
            id: 2,
            order: 0,//0和1 ，0:上移，1:下移
            createTime: '2019-02-20',
            goodsNum: 191,
            menu: []
        }],
        index: '',
        sortModalText: '',
        sortModalSort: '',
        // 大分类才有
        sortModalDesc: '',
        // 小分类才有
        sortModalImg: [],
        sortModalUrl: '',

        modalType: 0,  //0 添加分类 1删除分类
        delCategoryId: '',
        delCategoryParentId: '',

        editId: '',

        // 新增，可改变小分类所属大分类
        // category_parent_id_select: ""
    },
    methods: {
        changeCaret: function (id) {
            var collapseId = '#collapse' + id
            var collapseContainer = '#collapse-container' + id
            if ($(collapseId)[0].className == "caret-right") {
                $(collapseId).removeClass('caret-right')
                $(collapseId).addClass('caret')

                $(collapseContainer).removeClass('none')
            } else {
                $(collapseId).removeClass('caret')
                $(collapseId).addClass('caret-right')

                $(collapseContainer).addClass('none')
            }
        },
        getPage: function (index) {
            this.last_id = index
            getCategory()
        },
        getImg: function (id) {
            let imgUploadList = []
            const self = this, type = 'category_'
            // 图片blob 用于上传
            // let imgFiles = document.getElementById(id).files  //多张图上传
            // 多张图上传
            // for (let i = 0; i < imgFiles.length; i++) {
            //     imgUploadList.push({
            //         key: '',
            //         tempFilePath: window.URL.createObjectURL(imgFiles[i]),
            //         uploadToken: '',
            //         imgFile: imgFiles[i]
            //     })
            // }
            // qiniuUpload(imgUploadList, type, function (res) {
            //     self.sortModalImg = self.sortModalImg.concat(res)
            // })
            //单张图上传
            let imgFile = document.getElementById(id).files[0]
            imgUploadList[0] = {
                key: '',
                tempFilePath: window.URL.createObjectURL(imgFile),
                uploadToken: '',
                imgFile: imgFile
            }
            qiniuUpload(imgUploadList, type, function (res) {
                self.sortModalImg = res
            })
        },
        delImg: function (index) {
            this.sortModalImg.splice(index, 1)
        },
        addSort: function (index) {
            // init
            this.sortModalText = ""
            this.sortModalSort = ""
            this.sortModalImg = []
            this.parent_id = ""
            // init

            this.modalType = 0
            this.index = index
            if (index < 0) {
                $('#myModal').on('show.bs.modal', function () {
                    var modal = $(this)
                    modal.find('.modal-title').text('添加分类')
                })
            } else {
                const title = this.sortList[index].name
                $('#myModal').on('show.bs.modal', function () {
                    var modal = $(this)
                    modal.find('.modal-title').text('添加 "' + title + '" 分类')
                })
            }
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
        updateSort: function (id, sort) {
            updateCategorySort(id, sort)
        },
        EditSort: function (index, parent_id, id, name, sort, image, desc) {
            this.modalType = 2
            this.editId = id
            this.sortModalText = name
            this.sortModalSort = sort
            this.sortModalImg[0] = {
                key: image,
                tempFilePath: image
            }
            this.index = index
            if (parent_id == 0) {
                this.sortModalDesc = desc
            } else {
                this.sortModalUrl = desc
            }

            // 新增，改变小分类所属大分类
            if (this.modalType == 2 && this.index != -1) {
                this.parent_id = this.sortList[index].id
            }
            $('#myModal').on('show.bs.modal', function () {
                var modal = $(this)
                modal.find('.modal-title').text('编辑 "' + name + '" 分类')
            })
        },
        submitSortBtn: function () {
            if (this.modalType == 0 || this.modalType == 2) {
                // 添加分类
                let type = 0, parent_id = 0
                if (this.sortModalText == '') {
                    alert('请填写分类名称')
                    return
                } else if (this.sortModalSort == '') {
                    alert('请填写分类排序')
                    return
                } else if (this.sortModalImg == []) {
                    alert('请选择上传图片')
                    return
                }
                if (this.index < 0) {
                    // 大分类
                    // if (this.sortModalDesc == '') {
                    //     alert('请填写分类描述')
                    //     return
                    // }
                    type = 0, parent_id = 0
                } else {
                    // 小分类
                    // if (this.sortModalUrl == '') {
                    //     alert('请选择分类路径')
                    //     return
                    // }
                    // this.sortModalUrl = "/pages/category/category"
                    // type = 1, parent_id = this.sortList[this.index].id
                    type = 1, parent_id = this.parent_id || this.sortList[this.index].id
                }
                this.sortModalUrl = "/pages/category/category"
                let self = this, flag = 0
                for (let i in this.sortModalImg) {
                    if (this.sortModalImg[i].uploadToken) {
                        uploadImg(this.sortModalImg[i].key, this.sortModalImg[i].uploadToken, this.sortModalImg[i].imgFile, function (res) {
                            // flag 图片上传完毕之后才提交
                            flag++
                            if (flag == self.sortModalImg.length) {
                                // console.info('上传完毕')
                                if (self.modalType == 0) {
                                    addCategory(type, parent_id)
                                } else if (self.modalType == 2) {
                                    updateCategory(type, parent_id)
                                }
                            }
                        })
                    } else {
                        flag++
                        if (flag == self.sortModalImg.length) {
                            if (self.modalType == 2) {
                                updateCategory(type, parent_id)
                            }
                        }
                    }
                }
            } else if (this.modalType == 1) {
                // 删除分类
                delCategory(this.delCategoryParentId, this.delCategoryId)
            }

            $('#myModal').modal('hide')
        }
    }
})

$(document).ready(function () {
    getCategory()
})

function getCategory() {
    categoryVM.pageList = []
    categoryVM.sortList = []
    const url = api.getCategory, async = true
    let data = {}
    data.last_id = categoryVM.last_id
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.number > 0) {
            res.sortList.map(function (fn) {
                fn.create_time = formatTime(new Date(fn.create_time))
                if (fn.menu.length > 0) {
                    fn.menu.map(function (fn2) {
                        fn2.create_time = formatTime(new Date(fn2.create_time))
                        return fn2
                    })
                }
                return fn
            })
            categoryVM.sortList = res.sortList

            // 分页栏
            for (let i = 0; i < res.number / 5; i++) {
                categoryVM.pageList.push(i + 1)
            }
        }
    })
}

function addCategory(type, parent_id) {
    const url = api.addCategory, async = true
    let data = {}
    data.type = type
    data.parent_id = parent_id
    data.name = categoryVM.sortModalText
    data.sort = categoryVM.sortModalSort
    data.user_id = sessionStorage.getItem('user_id')
    // data.user_id = 0
    data.imgList = []
    for (let i in categoryVM.sortModalImg) {
        data.imgList.push(categoryVM.sortModalImg[i].key)
    }
    data.url = categoryVM.sortModalUrl
    data.describe = categoryVM.sortModalDesc
    server(url, data, async, "post", function (res) {
        if (res.text == '添加成功') {
            categoryVM.sortModalText = ''
            categoryVM.sortModalSort = ''
            categoryVM.sortModalDesc = ''
            categoryVM.sortModalUrl = ''
            categoryVM.sortModalImg = []
            $('#inputImg').val('')
            getCategory()
        }
    })
}

function delCategory(parent_id, id) {
    const url = api.delCategory, async = true
    let data = {}
    data.parent_id = parent_id
    data.id = id
    server(url, data, async, "post", function (res) {
        if (res.text == '删除成功') {
            getCategory()
        }
    })
}

function updateCategorySort(id, sort) {
    const url = api.updateCategorySort, async = true
    let data = {}
    data.id = id
    data.sort = sort
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.code == 0) {
            getCategory()
        }
    })
}

function updateCategory(type, parent_id) {
    const url = api.updateCategory, async = true
    let data = {}
    data.id = categoryVM.editId
    data.type = type
    data.parent_id = parent_id
    data.name = categoryVM.sortModalText
    data.sort = categoryVM.sortModalSort
    data.user_id = sessionStorage.getItem('user_id')
    // data.user_id = 0
    data.imgList = []
    for (let i in categoryVM.sortModalImg) {
        data.imgList.push(categoryVM.sortModalImg[i].key)
    }
    data.url = categoryVM.sortModalUrl
    data.describe = categoryVM.sortModalDesc
    server(url, data, async, "post", function (res) {
        if (res.code == 0) {
            categoryVM.sortModalText = ''
            categoryVM.sortModalSort = ''
            categoryVM.sortModalDesc = ''
            categoryVM.sortModalUrl = ''
            categoryVM.sortModalImg = []
            $('#inputImg').val('')
            getCategory()
        }
    })
}