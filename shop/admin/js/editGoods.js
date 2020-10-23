var editGoodsVM = new Vue({
    el: '#editGoods',
    data: {
        current_goods_List: {},
        imgList: [],
        imgLabelList: [],
        goods_title: '',
        goods_desc: '',
        goods_sort2: '',
        goods_limit: '',
        // brandList: [],
        // goods_brand_id: '',
        category_parent: [],
        category: [],
        category_parent_id_select: '',
        category_id_select: '',
        // qcl: [{
        //     id: 1,
        //     name: 'A',
        // }, {
        //     id: 2,
        //     name: 'B',
        // }, {
        //     id: 3,
        //     name: 'C',
        // }],
        // qcl_id: '',
        integralList: [{
            id: 0,
            name: '否'
        }, {
            id: 1,
            name: '是'
        }],
        integralSelect: 0,
        integralValue: '',
        typeList: [{
            id: 0,
            name: '瀑布流'
        }, {
            id: 1,
            name: '专题精选'
        }, {
            id: 2,
            name: '待定项'
        }],
        typeValue: 2,

        //默认的尺寸选择 不应进行改变 是固定值
        // specificationList: [{
        //     id: '',
        //     name: '颜色',
        // }, {
        //     id: '',
        //     name: '尺寸',
        // }],
        // paramList: [{
        //     name: '颜色',
        //     size: ['蓝色', '黄色', '红色']
        // }, {
        //     name: '尺寸',
        //     size: ['170cm', '175cm', '180cm']
        // }],
        // selectIndex: '',
        // sizeModalList: [],
        // paramImgList: [],
        //
        // SortItem: [],
        // sizeAndPrice: [],
        //
        // selectId0: '',
        // selectId1: '',

        goodsInfoImgList: [],
        state: '',

        // sortModalText: '',
        // sizeModalText: '',
        // sizeIndex: '',
        // selectText: '',

        batchPrice: '',
        batchStock: '',

        user_type: '',
        cate: '',
        // brand: '',
        // testList1:[1,2,3,4],
        // testList2:[]
        goods_stock: '',
        goods_price: '',
    },
    methods: {
        getImg: function (id) {
            let imgUploadList = []
            const self = this, type = 'goods_'
            // 图片blob 用于上传
            let imgFiles = document.getElementById(id).files  //多张图上传
            // console.info(imgFiles)
            // 多张图上传
            for (let i = 0; i < imgFiles.length; i++) {
                imgUploadList.push({
                    key: '',
                    tempFilePath: window.URL.createObjectURL(imgFiles[i]),
                    uploadToken: '',
                    imgFile: imgFiles[i]
                })
            }
            qiniuUpload(imgUploadList, type, function (res) {
                self.imgList = self.imgList.concat(res)
                // console.info(self.imgList)
            })

        },
        delImg: function (index) {
            this.imgList.splice(index, 1)
        },
        replaceImg: function (index) {
            let imgUploadList = []
            const self = this, type = 'goods_'
            let imgId = 'replaceImg' + index
            // 图片blob 用于上传
            let imgFile = document.getElementById(imgId).files[0]
            if (imgFile) {
                imgUploadList[0] = {
                    key: '',
                    tempFilePath: window.URL.createObjectURL(imgFile),
                    uploadToken: '',
                    imgFile: imgFile
                }
                qiniuUpload(imgUploadList, type, function (res) {
                    self.imgList.splice(index, 1, res[0])
                    // console.info(self.imgList)
                })
            }
        },
        getImg2: function (id) {
            let imgUploadList = []
            const self = this, type = 'goods_label_'
            // 图片blob 用于上传
            let imgFiles = document.getElementById(id).files  //多张图上传
            // 多张图上传
            for (let i = 0; i < imgFiles.length; i++) {
                imgUploadList.push({
                    key: '',
                    tempFilePath: window.URL.createObjectURL(imgFiles[i]),
                    uploadToken: '',
                    imgFile: imgFiles[i]
                })
            }
            qiniuUpload(imgUploadList, type, function (res) {
                self.imgLabelList = self.imgLabelList.concat(res)
                // console.info(self.imgList)
            })
        },
        delImg2: function (index) {
            this.imgLabelList.splice(index, 1)
        },
        replaceImg2: function (index) {
            let imgUploadList = []
            const self = this, type = 'goods_label_'
            let imgId = 'replaceImg2' + index
            // 图片blob 用于上传
            let imgFile = document.getElementById(imgId).files[0]
            if (imgFile) {
                imgUploadList[0] = {
                    key: '',
                    tempFilePath: window.URL.createObjectURL(imgFile),
                    uploadToken: '',
                    imgFile: imgFile
                }
                qiniuUpload(imgUploadList, type, function (res) {
                    self.imgLabelList.splice(index, 1, res[0])
                    // console.info(self.imgList)
                })
            }
        },
        // 商品详情图片 -->
        getInfoImg: function (id) {
            let imgUploadList = []
            const self = this, type = 'goodsInfo_'
            // 图片blob 用于上传
            let imgFiles = document.getElementById(id).files  //多张图上传
            // 多张图上传
            for (let i = 0; i < imgFiles.length; i++) {
                imgUploadList.push({
                    key: '',
                    tempFilePath: window.URL.createObjectURL(imgFiles[i]),
                    uploadToken: '',
                    imgFile: imgFiles[i]
                })
            }
            qiniuUpload(imgUploadList, type, function (res) {
                self.goodsInfoImgList = self.goodsInfoImgList.concat(res)
                // console.info(self.imgList)
            })

        },
        delInfoImg: function (index) {
            this.goodsInfoImgList.splice(index, 1)
        },
        replaceInfoImg: function (index) {
            let imgUploadList = []
            const self = this, type = 'goodsInfo_'
            let imgId = 'replaceInfoImg' + index
            // 图片blob 用于上传
            let imgFile = document.getElementById(imgId).files[0]
            if (imgFile) {
                imgUploadList[0] = {
                    key: '',
                    tempFilePath: window.URL.createObjectURL(imgFile),
                    uploadToken: '',
                    imgFile: imgFile
                }
                qiniuUpload(imgUploadList, type, function (res) {
                    self.goodsInfoImgList.splice(index, 1, res[0])
                    // console.info(self.imgList)
                })
            }
        },
        // <-- 商品详情图片

        haveCategoryParent: function (id) {
            let type = 1, parent_id = id
            this.category_id_select = ''
            getCategory(type, parent_id)
        },
        // 弹窗
        // addSort: function () {
        //     var text = '添加分类'
        //     $('#sortModal').on('show.bs.modal', function () {
        //         var modal = $(this)
        //         modal.find('#sortModalLabel').text(text)
        //     })
        // },
        // // 第一步 添加型号栏 商品的多重属性设置
        // addSortItem: function () {
        //     // this.testList2 = this.testList1 改变2 1也跟着改变
        //     // this.testList2 = this.testList2.concat(this.testList1) 改变2 1不变
        //     this.SortItem.push({
        //         select: '',
        //         select_id: '',
        //         haveParamImg: false,
        //         size: [],
        //         specificationList: this.specificationList
        //     })
        //     // this.SortItem[this.SortItem.length - 1].select = ''
        //     // this.SortItem[this.SortItem.length - 1].select_id = ''
        //     // this.SortItem[this.SortItem.length - 1].haveParamImg = false
        //     // this.SortItem[this.SortItem.length - 1].size = []
        //     // this.SortItem[this.SortItem.length - 1].specificationList = []
        //     // this.SortItem[this.SortItem.length - 1].specificationList = this.specificationList
        //
        // },
        // // 删除型号栏
        // delSortItem: function (index) {
        //     this.SortItem.splice(index, 1)
        //     for (let i in this.SortItem) {
        //         let sortId = 'sortId' + i
        //         document.getElementById(sortId).value = this.SortItem[i].select_id
        //     }
        // },
        //
        // // 类别
        // // 获取选择的option
        // getSelectSort: function (index) {
        //     // console.info(this.SortItem)
        //     var sortId = 'sortId' + index
        //     var select_id = document.getElementById(sortId).value
        //     var select = ''
        //     for (let i in this.specificationList) {
        //         if (select_id == this.specificationList[i].id) {
        //             select = this.specificationList[i].name
        //         }
        //     }
        //     for (let i in this.SortItem) {
        //         // 不能选择相同类型的 选择了就警告 并且选项置空
        //         if (this.SortItem[i].select == select) {
        //             document.getElementById(sortId).value = ''
        //             select = ''
        //             this.SortItem[index].size = []
        //             // 警告框展示隐藏
        //             var alertId = '#alert' + index
        //             $(alertId).addClass('inline-block')
        //             setTimeout(function () {
        //                 $(alertId).addClass('none')
        //                 $(alertId).removeClass('inline-block')
        //             }, 2000)
        //         }
        //     }
        //     this.SortItem[index].select = select
        //     this.SortItem[index].select_id = select_id
        //     this.SortItem[index].size = []
        //     // console.info(this.SortItem)
        //     // 大概是vue的bug 对SortItem内的对象的元素进行添加 数组有值 但页面不会触发改变
        //     // 直接对数组进行更改才会触发改变
        //     // html页面 v-if="item.select" 无法触发
        //     // 所以加了下面两句
        //     // this.SortItem.push(null)
        //     // this.SortItem.pop()
        // },
        // submitSortBtn: function () {
        //     // 直接添加到数据库 然后刷新
        //     if (this.sortModalText != '') {
        //         addSpecification(this.sortModalText)
        //     }
        //     // if (this.sortModalText != '') {
        //     //     this.specificationList.push(this.sortModalText)
        //     //     if (this.specificationList.length > this.paramList.length) {
        //     //         this.paramList.push([])
        //     //     }
        //     //     this.paramList[this.paramList.length - 1].name = this.sortModalText
        //     //     this.paramList[this.paramList.length - 1].size = []
        //     //     this.sortModalText = ''
        //     //     $('#sortModal').modal('hide')
        //     // }
        // },
        //
        // // 尺寸
        // addSize: function (selectText, selectIndex) {
        //     this.selectIndex = selectIndex
        //     for (var j in this.paramList) {
        //         if (this.paramList[j].name == selectText) {
        //             var title = this.paramList[j].name
        //             this.sizeIndex = j
        //             this.selectText = selectText
        //             this.sizeModalList = []
        //             this.sizeModalList = this.sizeModalList.concat(this.paramList[j].size)
        //         }
        //     }
        //     for (var i = this.sizeModalList.length - 1; i >= 0; i--) {
        //         for (var k in this.SortItem) {
        //             for (var y in this.SortItem[k].size) {
        //                 if (this.SortItem[k].size[y].name == this.sizeModalList[i]) {
        //                     this.sizeModalList.splice(i, 1)
        //                 }
        //             }
        //         }
        //     }
        //
        //     $('#sizeModal').on('show.bs.modal', function () {
        //         var modal = $(this)
        //         modal.find('#sizeModalLabel').text(title)
        //     })
        // },
        // delSize: function (index, sizeName) {
        //     for (var f = this.SortItem[index].size.length - 1; f >= 0; f--) {
        //         // console.info(f)
        //         if (this.SortItem[index].size[f].name == sizeName) {
        //             this.SortItem[index].size.splice(f, 1)
        //             // break
        //         }
        //     }
        //     // 添加下面两句 理由如上
        //     // this.SortItem.push(null)
        //     // this.SortItem.pop()
        //
        //     let key = 'param_' + Number(index + 1)
        //     this.sizeAndPrice = this.sizeAndPrice.filter(function (res) {
        //         return res[key] != sizeName
        //     })
        // },
        // // 只有一个参数需要图片
        // getParamImgIndex: function (index) {
        //     this.SortItem = this.SortItem.map(function (res) {
        //         res.haveParamImg = false
        //         return res
        //     })
        //     this.SortItem[index].haveParamImg = true
        //     // this.SortItem.push(null)
        //     // this.SortItem.pop()
        // },
        //
        // // 参数图片
        // getParamImg: function (index, id) {
        //     let paramImg_id = 'paramImg' + id
        //     let imgUploadList = []
        //     const self = this, type = 'goods_param_'
        //     // 图片blob 用于上传
        //     let imgFiles = document.getElementById(paramImg_id).files  //多张图上传
        //     // 多张图上传
        //     for (let i = 0; i < imgFiles.length; i++) {
        //         imgUploadList.push({
        //             key: '',
        //             tempFilePath: window.URL.createObjectURL(imgFiles[i]),
        //             uploadToken: '',
        //             imgFile: imgFiles[i]
        //         })
        //     }
        //     qiniuUpload(imgUploadList, type, function (res) {
        //         self.SortItem[index].size[id].img = res
        //         // self.SortItem.push(null)
        //         // self.SortItem.pop()
        //         // console.info(self.imgList)
        //     })
        // },
        // replaceParamImg: function (index, id) {
        //     let imgUploadList = []
        //     const self = this, type = 'goods_param_'
        //     let imgId = 'reParamImg' + id
        //     // 图片blob 用于上传
        //     let imgFile = document.getElementById(imgId).files[0]
        //     if (imgFile) {
        //         imgUploadList[0] = {
        //             key: '',
        //             tempFilePath: window.URL.createObjectURL(imgFile),
        //             uploadToken: '',
        //             imgFile: imgFile
        //         }
        //         qiniuUpload(imgUploadList, type, function (res) {
        //             self.SortItem[index].size[id].img = res
        //             // self.SortItem.push(null)
        //             // self.SortItem.pop()
        //         })
        //     }
        // },
        // // delParamImg: function (id) {
        // //
        // // },
        //
        // addOneSize: function () {
        //     if (this.sizeModalText != '') {
        //         let self = this,
        //             isadd1 = this.sizeModalList.every(function (res) {
        //                 if (res == self.sizeModalText) {
        //                     return false
        //                 }
        //                 return true
        //             }),
        //             isadd2 = this.SortItem[this.selectIndex].size.every(function (res) {
        //                 if (res.name == self.sizeModalText) {
        //                     return false
        //                 }
        //                 return true
        //             })
        //         if (isadd1 && isadd2) {
        //             this.sizeModalList.push(this.sizeModalText)
        //             this.sizeModalText = ''
        //             this.paramList[this.sizeIndex].size = []
        //             this.paramList[this.sizeIndex].size = this.paramList[this.sizeIndex].size.concat(this.sizeModalList)
        //         } else {
        //             alert('已经有相同参数了！！！')
        //         }
        //     }
        // },
        // submitSizeBtn: function () {
        //     var check = document.getElementsByName('sizeCheckbox')
        //     var index = ''
        //     for (var k in this.SortItem) {
        //         if (this.SortItem[k].select == this.selectText) {
        //             index = k
        //         }
        //     }
        //     var addList = []
        //     for (var i in check) {
        //         if (check[i].checked) {
        //             addList.push({
        //                 name: this.sizeModalList[i],
        //                 img: []
        //             })
        //             // this.SortItem[index].size.push({
        //             //     name: this.sizeModalList[i],
        //             //     img: []
        //             // })
        //             check[i].checked = false
        //         }
        //     }
        //     this.SortItem[index].size = this.SortItem[index].size.concat(addList)
        //     // console.info(addList)
        //     this.sizeModalList = []
        //     // 添加下面两句 理由如上
        //     // this.SortItem.push(null)
        //     // this.SortItem.pop()
        //     $('#sizeModal').modal('hide')
        //
        //     // 价格库存数组
        //     let tempList = []
        //     tempList = this.SortItem.map(function (res) {
        //         return res.size
        //     })
        //     if (this.sizeAndPrice.length <= 0) {
        //         if (tempList.length == 2) {
        //             let num = 0
        //             for (let i = 0; i < tempList[0].length; i++) {
        //                 for (let j = 0; j < tempList[1].length; j++) {
        //                     let key1 = 'param_1', key2 = 'param_2'
        //                     this.sizeAndPrice.push({})
        //                     this.sizeAndPrice[num][key1] = tempList[0][i].name
        //                     this.sizeAndPrice[num][key2] = tempList[1][j].name
        //                     this.sizeAndPrice[num]['price'] = ''
        //                     this.sizeAndPrice[num]['stock'] = ''
        //                     // if (tempList[0][i].img.length > 0) {
        //                     //     this.sizeAndPrice[num]['image'] = tempList[0][i].img[0].key
        //                     // }
        //                     // if (tempList[1][j].img.length > 0) {
        //                     //     this.sizeAndPrice[num]['image'] = tempList[1][j].img[0].key
        //                     // }
        //                     num++
        //                 }
        //             }
        //         }
        //     } else {
        //         if (tempList.length == 2) {
        //             let num = this.sizeAndPrice.length
        //             if (index == 0) {
        //                 for (let i = 0; i < addList.length; i++) {
        //                     for (let j = 0; j < tempList[1].length; j++) {
        //                         let key1 = 'param_1', key2 = 'param_2'
        //                         this.sizeAndPrice.push({})
        //                         this.sizeAndPrice[num][key1] = addList[i].name
        //                         this.sizeAndPrice[num][key2] = tempList[1][j].name
        //                         this.sizeAndPrice[num]['price'] = ''
        //                         this.sizeAndPrice[num]['stock'] = ''
        //                         // if (addList[i].img.length > 0) {
        //                         //     this.sizeAndPrice[num]['image'] = addList[i].img[0].key
        //                         // }
        //                         // if (tempList[1][j].img.length > 0) {
        //                         //     this.sizeAndPrice[num]['image'] = tempList[1][j].img[0].key
        //                         // }
        //                         num++
        //                     }
        //                 }
        //             } else if (index == 1) {
        //                 for (let i = 0; i < tempList[0].length; i++) {
        //                     for (let j = 0; j < addList.length; j++) {
        //                         let key1 = 'param_1', key2 = 'param_2'
        //                         this.sizeAndPrice.push({})
        //                         this.sizeAndPrice[num][key1] = tempList[0][i].name
        //                         this.sizeAndPrice[num][key2] = addList[j].name
        //                         this.sizeAndPrice[num]['price'] = ''
        //                         this.sizeAndPrice[num]['stock'] = ''
        //                         // if (tempList[0][i].img.length > 0) {
        //                         //     this.sizeAndPrice[num]['image'] = tempList[0][i].img[0].key
        //                         // }
        //                         // if (addList[j].img.length > 0) {
        //                         //     this.sizeAndPrice[num]['image'] = addList[j].img[0].key
        //                         // }
        //                         num++
        //                     }
        //
        //                 }
        //             }
        //         }
        //     }
        //
        //     // console.info(this.sizeAndPrice)
        // },
        //
        // // 价格和库存
        // getParamPriceAndPrice: function (tag, index1, index2, param_1, param_2) {
        //     let id = tag + '_' + param_1 + '_' + param_2
        //     let value = document.getElementById(id).value
        //     if (this.SortItem.length == 2) {
        //         if (tag == 'paramPrice') {
        //             this.sizeAndPrice = this.sizeAndPrice.map(function (res) {
        //                 if (res.param_1 == param_1 && res.param_2 == param_2) {
        //                     res.price = value
        //                 }
        //                 return res
        //             })
        //         } else if (tag == 'paramStock') {
        //             this.sizeAndPrice = this.sizeAndPrice.map(function (res) {
        //                 if (res.param_1 == param_1 && res.param_2 == param_2) {
        //                     res.stock = value
        //                 }
        //                 return res
        //             })
        //         }
        //
        //     }
        //     // console.info(this.sizeAndPrice)
        // },
        //
        // // 批量改价
        // batchChangePrice: function () {
        //     let self = this
        //     console.info(this.sizeAndPrice)
        //     console.info(this.SortItem)
        //     self.sizeAndPrice = self.sizeAndPrice.map(function (eData) {
        //         eData.price = Number(self.batchPrice)
        //         let tag = 'paramPrice_'
        //         let id = tag + eData.param_1 + '_' + eData.param_2
        //         console.info(id)
        //         document.getElementById(id).value = Number(self.batchPrice)
        //         return eData
        //     })
        //     // let index1_length = this.SortItem[0].size.length
        //     // let index2_length = this.SortItem[1].size.length
        //     // let tag = 'paramPrice'
        //     // for (let i = 0; i < index1_length; i++) {
        //     //     for (let j = 0; j < index2_length; j++) {
        //     //         let id = tag + i + '_' + j
        //     //         document.getElementById(id).value = Number(self.batchPrice)
        //     //     }
        //     // }
        // },
        // batchChangeStock: function () {
        //     let self = this
        //     self.sizeAndPrice = self.sizeAndPrice.map(function (eData) {
        //         eData.stock = Number(self.batchStock)
        //         let tag = 'paramStock_'
        //         let id = tag + eData.param_1 + '_' + eData.param_2
        //         document.getElementById(id).value = Number(self.batchStock)
        //         return eData
        //     })
        //     // let index1_length = this.SortItem[0].size.length
        //     // let index2_length = this.SortItem[1].size.length
        //     // let tag = 'paramStock'
        //     // for (let i = 0; i < index1_length; i++) {
        //     //     for (let j = 0; j < index2_length; j++) {
        //     //         let id = tag + i + '_' + j
        //     //         document.getElementById(id).value = Number(self.batchStock)
        //     //     }
        //     // }
        // },

        // 商品提交
        submitGoods: function (state) {
            this.state = state
            if (this.imgList.length <= 0) {
                alert('请选择商品图片')
                return
            }
            if (this.goods_title == '') {
                alert('请填写商品标题')
                return
            }
            if (this.goods_sort2.length <= 0) {
                alert('请填写商品排序')
                return
            }
            if (this.goods_limit.length <= 0) {
                alert('请填写一单限购数量')
                return
            }
            // if (this.goods_brand_id == '') {
            //     alert('请选择商品品牌')
            //     return
            // }
            // if (this.qcl_id == '') {
            //     alert('请选择商品品级')
            //     return
            // }
            if (this.category_parent_id_select == '') {
                alert('请选择大分类')
                return
            }
            if (this.category_id_select == '') {
                alert('请选择小分类')
                return
            }
            if (this.integralSelect == 0) {
                if (this.typeValue === '') {
                    alert('请选择商品推荐')
                    return
                }
            }
            if (this.integralSelect == 1) {
                if (this.integralValue == '') {
                    alert('请填写购买商品所需积分')
                    return
                }
                if (this.integralValue == 0) {
                    alert('请购买商品所需积分不能为0')
                    return
                }
            }
            if (this.goods_stock == "") {
                alert("请填写库存")
                return
            }
            if (this.goods_price == "") {
                alert("请填写价格")
                return
            }
            // if (!this.typeValue.toString()) {
            //     alert('请选择商品推荐')
            //     return
            // }
            // if (this.SortItem.length <= 0) {
            //     alert('请选择商品型号')
            //     return
            // } else if (this.SortItem.length == 1) {
            //     alert('请选择商品型号第二个参数')
            //     return
            // }
            // for (let i in this.SortItem) {
            //     if (this.SortItem[i].size.length <= 0) {
            //         let text = '请添加第' + (i == 0 ? '一' : '二') + '个规格的参数'
            //         alert(text)
            //         return
            //     }
            // }
            // let haveParamImg = this.SortItem.some(function (res) {
            //     if (res.haveParamImg) {
            //         return true
            //     }
            //     return false
            // })
            // if (!haveParamImg) {
            //     alert('请选择商品型号图片')
            //     return
            // }
            // for (let i in this.SortItem) {
            //     if (this.SortItem[i].haveParamImg) {
            //         haveParamImg = this.SortItem[i].size.every(function (res) {
            //             if (res.img.length == '') {
            //                 return false
            //             }
            //             return true
            //         })
            //         if (!haveParamImg) {
            //             alert('请给选中的商品型号添加完图片')
            //             return
            //         }
            //     }
            // }
            // let havePriceAndStock = this.sizeAndPrice.every(function (res) {
            //     if (res.price == '' || res.stock.toString() == '') {
            //         return false
            //     }
            //     return true
            // })
            // if (!havePriceAndStock) {
            //     alert('请补充完价格库存量')
            //     return
            // }
            // if (this.goodsInfoImgList.length <= 0) {
            //     alert('请选择商品详情图片')
            //     return
            // }

            // 开始上传 需要loading 图标 防误触

            let imgUploadIsOkNum = 0
            // 全部验证完毕 开始上传图片 有图片的地方分别是 1.imgList 2.SortItem>size>img 3.goodsInfoImgList
            if (this.imgList.length > 0) {
                let self = this, flag = 0, keyNum = 0
                for (let i in this.imgList) {
                    if (this.imgList[i].key) {
                        keyNum++
                    }
                }
                if (keyNum > 0) {
                    for (let i in this.imgList) {
                        if (this.imgList[i].key) {
                            uploadImg(this.imgList[i].key, this.imgList[i].uploadToken, this.imgList[i].imgFile, function (res) {
                                // flag 图片上传完毕之后才提交
                                flag++
                                if (flag == keyNum) {
                                    console.info('上传完毕')
                                    imgUploadIsOkNum = imgUploadIsOkNum + 1
                                }
                            })
                        }
                    }
                } else {
                    imgUploadIsOkNum = imgUploadIsOkNum + 1
                    console.info('imgList没有新图片')
                }
            }

            if (this.imgLabelList.length > 0) {
                let self = this, flag = 0, keyNum = 0
                for (let i in this.imgLabelList) {
                    if (this.imgLabelList[i].key) {
                        keyNum++
                    }
                }
                if (keyNum > 0) {
                    for (let i in this.imgLabelList) {
                        if (this.imgLabelList[i].key) {
                            uploadImg(this.imgLabelList[i].key, this.imgLabelList[i].uploadToken, this.imgLabelList[i].imgFile, function (res) {
                                // flag 图片上传完毕之后才提交
                                flag++
                                if (flag == keyNum) {
                                    console.info('上传完毕')
                                    imgUploadIsOkNum = imgUploadIsOkNum + 1
                                }
                            })
                        }
                    }
                } else {
                    imgUploadIsOkNum = imgUploadIsOkNum + 1
                    console.info('imgList没有新图片')
                }
            }
            // for (let i in this.SortItem) {
            //     if (this.SortItem[i].haveParamImg) {
            //         let self = this, flag = 0, keyNum = 0
            //         for (let j in this.SortItem[i].size) {
            //             if (this.SortItem[i].size[j].img[0].key) {
            //                 keyNum++
            //             }
            //         }
            //         if (keyNum > 0) {
            //             for (let j in this.SortItem[i].size) {
            //                 if (this.SortItem[i].size[j].img[0].key) {
            //                     uploadImg(this.SortItem[i].size[j].img[0].key, this.SortItem[i].size[j].img[0].uploadToken, this.SortItem[i].size[j].img[0].imgFile, function (res) {
            //                         // flag 图片上传完毕之后才提交
            //                         flag++
            //                         if (flag == keyNum) {
            //                             console.info('上传完毕')
            //                             imgUploadIsOkNum = imgUploadIsOkNum + 1
            //                         }
            //                     })
            //                 }
            //             }
            //         } else {
            //             imgUploadIsOkNum = imgUploadIsOkNum + 1
            //             console.info('SortItem没有新图片')
            //         }
            //     }
            // }
            if (this.goodsInfoImgList.length > 0) {
                let self = this, flag = 0, keyNum = 0
                for (let i in this.goodsInfoImgList) {
                    if (this.goodsInfoImgList[i].key) {
                        keyNum++
                    }
                }
                if (keyNum > 0) {
                    for (let i in this.goodsInfoImgList) {
                        if (this.goodsInfoImgList[i].key) {
                            uploadImg(this.goodsInfoImgList[i].key, this.goodsInfoImgList[i].uploadToken, this.goodsInfoImgList[i].imgFile, function (res) {
                                // flag 图片上传完毕之后才提交
                                flag++
                                if (flag == keyNum) {
                                    console.info('上传完毕')
                                    imgUploadIsOkNum = imgUploadIsOkNum + 1
                                }
                            })
                        }
                    }
                } else {
                    imgUploadIsOkNum = imgUploadIsOkNum + 1
                    // console.info('goodsInfoImgList没有新图片')
                }
            }

            let labelLen = this.imgLabelList.length
            let scroll = setInterval(function () {
                if ((labelLen <= 0 && imgUploadIsOkNum == 2) || (labelLen > 0 && imgUploadIsOkNum == 3)) {
                    editGoods()
                    clearInterval(scroll)
                }
            }, 500)
        }
    }
})

$(document).ready(function () {
    editGoodsVM.user_type = sessionStorage.getItem('type')
    if (editGoodsVM.user_type == 1) {
        editGoodsVM.cate = sessionStorage.getItem('cate')
        // editGoodsVM.brand = sessionStorage.getItem('brand')
    }
    getCurrentGoodsInfo()

    // getBrand()
    getCategory(0, 0)
    // getSpecification()
})

function getCurrentGoodsInfo() {
    let current_goods_List = JSON.parse(sessionStorage.getItem('editGoods'))[0]
    // console.info('获取当前商品数据\n' + JSON.stringify(current_goods_List))
    if (current_goods_List.image.length > 0) {
        current_goods_List.image.map(function (res) {
            editGoodsVM.imgList.push({
                tempFilePath: res
            })
        })
    }
    if (current_goods_List.label && current_goods_List.label.length > 0) {
        current_goods_List.label.map(function (res) {
            editGoodsVM.imgLabelList.push({
                tempFilePath: res
            })
        })
    }
    editGoodsVM.goods_id = current_goods_List.id
    editGoodsVM.goods_title = current_goods_List.name
    editGoodsVM.goods_desc = current_goods_List.describe
    editGoodsVM.goods_sort2 = current_goods_List.sort2
    editGoodsVM.goods_limit = current_goods_List.limit

    editGoodsVM.goods_price = current_goods_List.price
    editGoodsVM.goods_stock = current_goods_List.stock
    // editGoodsVM.goods_brand_id = current_goods_List.brand_id
    // editGoodsVM.qcl_id = current_goods_List.qcl
    // integralSelect
    if (current_goods_List.integral_price == 0) {
        editGoodsVM.integralSelect = 0
    } else if (current_goods_List.integral_price > 0) {
        editGoodsVM.integralSelect = 1
    }
    editGoodsVM.integralValue = current_goods_List.integral_price
    editGoodsVM.typeValue = current_goods_List.type
    editGoodsVM.category_parent_id_select = current_goods_List.category_parent_id
    getCategory(1, current_goods_List.category_parent_id)
    editGoodsVM.category_id_select = current_goods_List.category_id_1
    // editGoodsVM.sizeAndPrice = current_goods_List.param
    // for (let i = 0; i <= 1; i++) {
    //     // editGoodsVM.SortItem[i].select = select
    //     editGoodsVM.SortItem.push({
    //         select_id: current_goods_List['specification_id_' + Number(i + 1)],
    //         size: [],
    //         haveParamImg: false
    //     })
    //     // 这边通过select_id去查找item_param
    //     getParam(current_goods_List.id, current_goods_List['specification_id_' + Number(i + 1)])
    // }

    // getSpecification()


    // console.info(editGoodsVM.sizeAndPrice)
    for (let i in current_goods_List.goods_info) {
        editGoodsVM.goodsInfoImgList.push({
            tempFilePath: current_goods_List.goods_info[i]
        })
    }

}

// function getParam(goods_id, specification_id) {
//     const url = api.getParam, async = true
//     let data = {}
//     data.goods_id = goods_id
//     data.specification_id = specification_id
//     server(url, data, async, "post", function (res) {
//         // console.info(res)
//         if (res.length > 0) {
//             for (let i in editGoodsVM.SortItem) {
//                 if (editGoodsVM.SortItem[i].select_id == specification_id) {
//                     editGoodsVM.SortItem[i].size = res.map(function (f) {
//                         if (f.img) {
//                             let temp = f.img
//                             f.img = []
//                             f.img.push({
//                                 tempFilePath: temp
//                             })
//                             editGoodsVM.SortItem[i].haveParamImg = true
//                         } else {
//                             f.img = ''
//                         }
//                         return f
//                     })
//                     // console.info(editGoodsVM.SortItem)
//                 }
//             }
//         }
//     })
// }

// function getBrand() {
//     const url = api.getBrand, async = true
//     let data = {}
//     server(url, data, async, "post", function (res) {
//         if (res.length > 0) {
//             if (editGoodsVM.user_type == 0) {
//                 editGoodsVM.brandList = res
//             } else if (editGoodsVM.user_type == 1) {
//                 let brand = JSON.parse(editGoodsVM.brand)
//                 editGoodsVM.brandList = res.filter(function (eData) {
//                     // for (let i in brand) {
//                     //     return brand[i] == eData.id
//                     // }
//                     for (let i in brand) {
//                         if(brand[i] == eData.id){
//                             return true
//                         }
//                     }
//                     return false
//                 })
//             }
//
//         }
//     })
// }

function getCategory(type, parent_id) {
    const url = api.getCategory, async = true
    let data = {}
    data.type = type
    data.parent_id = parent_id
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.length > 0) {
            if (editGoodsVM.user_type == 0) {
                if (type == 0) {
                    editGoodsVM.category_parent = res
                } else if (type == 1) {
                    editGoodsVM.category = res
                }
            } else if (editGoodsVM.user_type == 1) {
                if (type == 0) {
                    let cate = JSON.parse(editGoodsVM.cate)[0]
                    editGoodsVM.category_parent = res.filter(function (eData) {
                        // for (let i in cate) {
                        //     return cate[i] == eData.id
                        // }
                        for (let i in cate) {
                            if (cate[i] == eData.id) {
                                return true
                            }
                        }
                        return false
                    })
                } else if (type == 1) {
                    let cate = JSON.parse(editGoodsVM.cate)[1]
                    editGoodsVM.category = res.filter(function (eData) {
                        // for (let i in cate) {
                        //     return cate[i] == eData.id
                        // }
                        for (let i in cate) {
                            if (cate[i] == eData.id) {
                                return true
                            }
                        }
                        return false
                    })
                }
            }

        }
    })
}

// function getSpecification() {
//     const url = api.getSpecification, async = true
//     let data = {}
//     server(url, data, async, "post", function (res) {
//         // console.info(res)
//         if (res.specification.length > 0) {
//             editGoodsVM.specificationList = res.specification
//             if (editGoodsVM.SortItem.length > 0) {
//                 editGoodsVM.SortItem = editGoodsVM.SortItem.map(function (s, index) {
//                     s.specificationList = res.specification
//                     for (let j in res.specification) {
//                         if (res.specification[j].id == s.select_id) {
//                             s.select = res.specification[j].name
//                             editGoodsVM['selectId' + index] = res.specification[j].id
//                         }
//                     }
//                     return s
//                 })
//             }
//         }
//         // console.info(editGoodsVM.SortItem)
//         if (res.paramList.length > 0) {
//             // console.info(res.paramList)
//             editGoodsVM.paramList = res.paramList
//             // for (let i in editGoodsVM.SortItem) {
//             //     editGoodsVM.paramList.map(function (res) {
//             //         editGoodsVM.SortItem[i].size.push({
//             //             img: 1,
//             //             name: 2
//             //         })
//             //     })
//             // }
//         }
//         for (let i in editGoodsVM.sizeAndPrice) {
//             let priceId = 'paramPrice_' + editGoodsVM.sizeAndPrice[i].param_1 + '_' + editGoodsVM.sizeAndPrice[i].param_2
//             document.getElementById(priceId).value = editGoodsVM.sizeAndPrice[i].price
//             let stockId = 'paramStock_' + editGoodsVM.sizeAndPrice[i].param_1 + '_' + editGoodsVM.sizeAndPrice[i].param_2
//             document.getElementById(stockId).value = editGoodsVM.sizeAndPrice[i].stock
//         }
//     })
// }

// function addSpecification(name) {
//     const url = api.addSpecification, async = true
//     let data = {}
//     data.name = name
//     data.user_id = sessionStorage.getItem('user_id')
//     // data.user_id = 0
//     server(url, data, async, "post", function (res) {
//         // console.info(res)
//         if (res.text == '添加成功') {
//             getSpecification()
//             $('#sortModal').modal('hide')
//         }
//     })
// }

function editGoods() {
    // console.info(editGoodsVM.imgList)
    // console.info(editGoodsVM.goods_title)
    // console.info(editGoodsVM.goods_brand_id)
    // console.info(editGoodsVM.qcl_id)
    // console.info(editGoodsVM.category_parent_id_select)
    // console.info(editGoodsVM.category_id_select)
    // console.info(editGoodsVM.SortItem)
    // console.info(editGoodsVM.sizeAndPrice)
    // console.info(editGoodsVM.goodsInfoImgList)
    // console.info(editGoodsVM.state)

    const url = api.updateGoods, async = true
    let data = {}
    data.goods_id = editGoodsVM.goods_id
    data.user_id = sessionStorage.getItem('user_id')
    // data.user_id = 0
    data.imgList = editGoodsVM.imgList
    data.label = editGoodsVM.imgLabelList
    //     .map(function (res) {
    //     if (res.key) {
    //         return res.key
    //     }
    //     return res.tempFilePath
    // })
    data.goods_title = editGoodsVM.goods_title
    data.goods_desc = editGoodsVM.goods_desc
    data.goods_sort2 = editGoodsVM.goods_sort2
    data.goods_limit = editGoodsVM.goods_limit
    // data.goods_brand_id = editGoodsVM.goods_brand_id
    // data.qcl_id = editGoodsVM.qcl_id
    if (editGoodsVM.integralSelect == 0) {
        data.type = editGoodsVM.typeValue
        data.integralValue = 0
    } else {
        data.type = 2
        data.integralValue = editGoodsVM.integralValue
    }
    // data.type = editGoodsVM.typeValue
    // data.category_parent_id_select = editGoodsVM.category_parent_id_select
    data.category_id_select = editGoodsVM.category_id_select
    // data.paramItem = editGoodsVM.SortItem
    // for (let i in data.paramItem) {
    //     if (data.paramItem[i].haveParamImg) {
    //         for (let j in data.paramItem[i].size) {
    //             console.info(data.paramItem[i].size[j].img)
    //             if(data.paramItem[i].size[j].img[0].key){
    //                 let tempImg = data.paramItem[i].size[j].img[0].key
    //                 data.paramItem[i].size[j].img[0] = ''
    //                 data.paramItem[i].size[j].img[0] = tempImg
    //             }else{
    //                 let tempImg = data.paramItem[i].size[j].img[0].tempFilePath
    //                 data.paramItem[i].size[j].img[0] = ''
    //                 data.paramItem[i].size[j].img[0] = tempImg
    //             }
    //         }
    //     }
    // }
    // data.paramAndPrice = editGoodsVM.sizeAndPrice
    // data.price = data.paramAndPrice.sort(function (a, b) {
    //     return Number(a.price - b.price)
    // })
    // data.price = data.price[0].price
    data.stock = editGoodsVM.goods_stock
    data.price = editGoodsVM.goods_price
    data.goodsInfoImgList = editGoodsVM.goodsInfoImgList
    //     .map(function (res) {
    //     if (res.key) {
    //         return res.key
    //     }
    //     return res.tempFilePath
    // })
    data.state = editGoodsVM.state

    // console.info(data)
    server(url, data, async, "post", function (res) {
        // console.info(res)
        if (res.text == '更新成功') {
            alert('更新成功')
            window.location.href = "goods"
            // var href = './goods-manage.html'
            // $("#container").load(href);
            // sessionStorage.setItem("href", href);
        }
    })

}

// 时间控件
// laydate.render({
//     elem: '#test5'
//     , type: 'datetime'
// });