var editBrandVM = new Vue({
    el: '#editBrand',
    data: {
        imageList: [],
        name: '',
        desc: '',
        sort: '',
        price: '',
        urlList: ['/pages/brandDetail/brandDetail'],
        url_select: '',

        brand_id: '',
    },
    methods: {
        // changePage: function (e) {
        //     var href = './' + e + '.html'
        //     $("#container").load(href);
        //     sessionStorage.setItem("href", href);
        // },
        getImg: function (id) {
            let imgUploadList = []
            const self = this, type = 'brand_'
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
                self.imageList = res
            })
        },
        delImg: function (index) {
            this.imageList.splice(index, 1)
        },
        submit: function (state) {
            if (this.imageList.length <= 0) {
                alert('请添加品牌图片')
                return
            }
            if (this.name == '') {
                alert('请填写品牌名称')
                return
            }
            if (this.desc == '') {
                alert('请填写品牌介绍')
                return
            }
            if (this.price == '') {
                alert('请填写品牌价格')
                return
            }
            if (this.sort == '') {
                alert('请填写排序')
                return
            }
            if (this.url_select == '') {
                alert('请选择路径')
                return
            }
            // let imgUploadIsOkNum = 0
            // 全部验证完毕 开始上传图片 有图片的地方分别是 1.imgList 2.SortItem>size>img 3.goodsInfoImgList
            if (this.imageList.length > 0) {
                let self = this, flag = 0, keyNum = 0
                for (let i in this.imageList) {
                    if (this.imageList[i].key) {
                        keyNum++
                    }
                }
                if (keyNum > 0) {
                    for (let i in this.imageList) {
                        if (this.imageList[i].key) {
                            uploadImg(this.imageList[i].key, this.imageList[i].uploadToken, this.imageList[i].imgFile, function (res) {
                                // flag 图片上传完毕之后才提交
                                flag++
                                if (flag == self.imageList.length) {
                                    updateBrand(state)
                                }
                            })
                        }
                    }
                } else {
                    updateBrand(state)
                }
            }
        }
    }
})

function updateBrand(state) {
    const url = api.updateBrand, async = true
    let data = {}
    data.id = editBrandVM.brand_id
    data.state = state
    data.name = editBrandVM.name
    data.desc = editBrandVM.desc
    data.sort = editBrandVM.sort
    data.price = editBrandVM.price
    data.url = editBrandVM.url_select
    data.user_id = sessionStorage.getItem('user_id')
    // data.user_id = 0
    data.imgList = editBrandVM.imageList
    server(url, data, async, "post", function (res) {
        if (res.text == '编辑成功') {
            alert('编辑成功')
            window.location.href = "brand"
            // var href = './brand.html'
            // $("#container").load(href);
            // sessionStorage.setItem("href", href);
        }
    })
}

$(document).ready(function () {
    getCurrentBrandInfo()
})

function getCurrentBrandInfo() {
    let current_brand_List = JSON.parse(sessionStorage.getItem('editBrand'))[0]
    console.info('获取当前商品数据\n' + JSON.stringify(current_brand_List))
    if (current_brand_List.image.length > 0) {
        editBrandVM.imageList.push({
            tempFilePath: current_brand_List.image
        })
    }
    editBrandVM.brand_id = current_brand_List.id
    editBrandVM.name = current_brand_List.name
    editBrandVM.price = current_brand_List.price
    editBrandVM.sort = current_brand_List.sort
    editBrandVM.desc = current_brand_List.desc
    editBrandVM.url_select = current_brand_List.url
}


// laydate.render({
//   elem: '#test5'
//   ,type: 'datetime'
// });