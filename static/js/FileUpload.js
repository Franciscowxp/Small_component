/*
    多文件上传，拖拽，类型判断，图片预览，上传进度，进度条，多种函数回调，功能可配置
*/
function FileUpload(opt) {
    this.fileInput = null, //html file控件
    this.dragDrop = null, //拖拽敏感区域
    this.dragActiveClass = null, //拖拽到敏感区域添加的类名
    this.previewBox = null, //图片预览区域
    this.selectButton = null, //文件选择按钮
    this.upButton = null, //提交按钮
    this.limitSize = 2, //限制文件上传大小(M)
    this.url = "", //ajax地址
    this.fileType = ['exe', 'rar', 'png', 'jpg', 'gif', 'txt'], //上传文件类型
    this.fileFilter = [] //过滤后的文件数组
    this.getOpt(opt);
    this.init();

}
FileUpload.prototype = {
    init: function() {
        this.funGetFiles();
        this.funDragHover();
        this.funRegisteUpload();
    },
    getOpt: function(opt) {
        for (var i in opt) {
            if (i in this) {
                this[i] = opt[i]
            }
        }
    },
    customFilter: function(files) { //选择文件组的过滤方法
        return files;
    },
    onSelect: function() {}, //文件选择后
    onDelete: function() {}, //文件删除后
    onDragEnter: function() {}, //文件进入拖拽到敏感区域时
    onDragOver: function() {}, //文件拖拽到敏感区域时
    onDragLeave: function() {}, //文件离开到敏感区域时
    onProgress: function() {}, //文件上传进度
    onSuccess: function() {}, //文件上传成功时
    onFailure: function() {}, //文件上传失败时,
    onComplete: function() {}, //文件全部上传完毕时
    funDragHover: function() {
        var that = this;
        this.dragDrop.addEventListener('dragenter', function(event) {
            event.preventDefault();
            event.stopPropagation();
            that.onDragEnter();
            that.dragDrop.classList.add(that.dragActiveClass);
        }, false)
        this.dragDrop.addEventListener('dragover', function(event) {
            event.preventDefault();
            event.stopPropagation();
            that.onDragOver();
        }, false)
        this.dragDrop.addEventListener('dragleave', function(event) {
            event.preventDefault();
            event.stopPropagation();
            that.onDragLeave();
            that.dragDrop.classList.remove(that.dragActiveClass);
        }, false)
    },
    funGetFiles: function() {
        var that = this;
        this.selectButton.addEventListener('click', function(event) {
            event.preventDefault();
            that.fileInput.click();
        }, false)
        this.fileInput.addEventListener('change', function() {
            that.funDealFiles(this.files);
            that.onSelect();
        }, false)
        this.dragDrop.addEventListener("drop", function(event) {
            event.preventDefault();
            event.stopPropagation();
            that.funDealFiles(event.dataTransfer.files);
        }, false)
    },
    funDealFiles: function(files) {
        var that = this;
        [].forEach.call(files, function(file) {
            var type = file.name.match(/.+\.(\w+)$/)[1];
            var isAllowType = that.fileType.some(function(value) {
                return value == type
            })
            if (isAllowType && (file.size / 1024 / 1024) <= that.limitSize) {
                that.fileFilter.push(that.customFilter(file));
                that.funPreviewFiles(that.customFilter(file));
            }
        })
    },
    funPreviewFiles: function(file) {
        var that = this;
        var reader = new FileReader();
        if (/image/.test(file.type)) {
            reader.readAsDataURL(file);
            reader.onload = function(event) {
                var div = document.createElement('div');
                var img = document.createElement('img');
                var span = document.createElement('span');
                img.src = this.result;
                span.innerHTML = file.name;
                div.appendChild(img);
                div.appendChild(span);
                that.previewBox.appendChild(div);
            }
        } else if (/text/.test(file.type)) {
            reader.readAsText(file);
            reader.onload = function(event) {
                var div = document.createElement('div');
                var span = document.createElement('span');
                var name = document.createElement('span');
                span.innerHTML = this.result.slice(0, 170);
                name.innerHTML = file.name
                div.appendChild(span);
                div.appendChild(name);
                that.previewBox.appendChild(div);
            }
        } else {
            var div = document.createElement('div');
            var i = document.createElement('i');
            var name = document.createElement('span');
            i.className = "icon file";
            name.innerHTML = file.name
            div.appendChild(i);
            div.appendChild(name);
            that.previewBox.appendChild(div);
        }
    },
    funDeleteFile: function() {},
    funRegisteUpload: function() {
        var that = this;
        this.upButton.addEventListener('click',function(event){
            event.preventDefault();
            that.fileFilter.forEach(function(file){
                that.funUploadFile(file);
            })
        },false)
    },
    funUploadFile: function(file) {
        var that = this;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.url, true);
        xhr.addEventListener('readystatechange', function(event) {
            if (xhr.readyState = 4) {
                that.onComplete();
                if (xhr.status == 200) {
                    that.onSuccess();
                    alert('ok')
                }
            }
        }, false)
        alert(file)
        xhr.send(file)
    }
}