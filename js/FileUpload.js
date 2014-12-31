/*
    多文件上传，拖拽，类型判断，图片预览，上传进度，进度条，多种函数回调，功能可配置
*/
var FileUpload = {
    fileInput: null, //html file控件
    dragDrop: null, //拖拽敏感区域
    dragActiveClass:null,//
    reviewBox:null,//图片预览区域
    upButton: null, //提交按钮
    url: "", //ajax地址
    fileType: [], //上传文件类型
    fileFilter: [], //过滤后的文件数组
    filter: function(files) { //选择文件组的过滤方法
        return files;
    },
    onSelect: function() {}, //文件选择后
    onDelete: function() {}, //文件删除后
    onDragOver: function() {}, //文件拖拽到敏感区域时
    onDragLeave: function() {}, //文件离开到敏感区域时
    onProgress: function() {}, //文件上传进度
    onSuccess: function() {}, //文件上传成功时
    onFailure: function() {}, //文件上传失败时,
    onComplete: function() {}, //文件全部上传完毕时
    funDragHover:function(){},
    funGetFiles:function(){},
    funDealFiles:function(){},
    funReviewFiles:function(){},
    funDeleteFile:function(){},
    funUploadFile:function(){},
    init:function(){}
}