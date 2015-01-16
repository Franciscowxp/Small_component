# Small_component

Some general web design component.

## Component 
    
### HTML5 uploader

* Support big file.
* Resume and Pause. it can support resume broken transfer.Don't need other library. 
* ProgressBar. 
* Use http not websocket
* Preview. preview some file like images and plain text.
    
* ####options
    
    * fileInput //html file dom 
    * dragDrop  //drop field dom
    * dragActiveClass  //the class name add to drop field after drop action
    * previewBox  //image preview field dom
    * selectButton  //the button that trigger the fileinput to select file
    * upButton  //upload button
    * limitSize = 2000; //global limited size (M)
    * sliceSize = 2; //cutting http file size (M). When uploading file is larger than this value, we use the breakpoint upload.But it is useful only when resumeUpload is enabled.
    * resumeUpload = true; //Whether to enable the breakpoint upload
    * url = ""; //upload url
    * fileType = ['exe', 'rar', 'png', 'jpg', 'gif', 'txt']; // upload file type
    * customFilter: function(file) {}, //custom filter function.It must return a file object
    * onSelect: function() {}, //after selecting file,it will be invoked 
    * onDelete: function() {}, //after removing file,it will be invoked 
    * onDragEnter: function() {}, //when droping file into drop field,it will be invoked
    * onDragOver: function() {}, //when droping file over drop field,it will be invoked
    * onDragLeave: function() {}, //when droping file leave drop field,it will be invoked
    * onProgress: function(prosize) {}, //when uploading,it will be invoked.the parameter  is Percentage progress
    * onSuccess: function() {}, //when single file uploads successfully,it will be invoked 
    * onFailure: function() {}, //when single file fails to upload fail,it will be invoked  
    * onComplete: function() {}, //when single file upload complete
 
* 
#### use

    * css 
    
        ```html
        <link rel="stylesheet" href="./static/css/fileupload.css"/>
        ```
    * javascript
        
        ```html
        <script type='text/javascript' src="./static/js/FileUpload.js"></script>
        ```
    * html template(in FileUpload.html)
        
        ```html
        <article class="fileUpload">
                .........
        </article>
        ```
    * run it 
        
        example:
        ```html
        new FileUpload({
        fileInput:null,
        selectButton:null,
        upButton:null,
        dragDrop:null,
        previewBox:null,
        dragActiveClass:'active',
        url:'/upload'
        })
        ```
