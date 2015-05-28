from flask import Flask,render_template,request
from werkzeug import secure_filename
import os
import urllib.parse
from time import sleep
app = Flask(__name__)
app.debug = True
app.host = '127.0.0.1'

ALLOWED_EXTENSIONS = {'gif', 'png', 'jpg', 'txt', 'jpeg', 'pdf','rar','exe'}
UPLOAD_FOLDER = '/upload'

class FileUpload(object):
    """docstring for FileUpload"""
    ### args  upload_folder(type is string):the upload folder
    ###       allowed_extensions(type is list):the file has the extension is allowed to upload
    def __init__(self,upload_folder,allowed_extensions={'gif', 'png', 'jpg', 'txt', 'jpeg','rar'}):
        super(FileUpload, self).__init__()
        self.upload_folder = upload_folder
        self.allowed_extensions = allowed_extensions


    def allowed_file(self,filename):
        return '.' in filename and filename.rsplit('.', 1)[1] in self.allowed_extensions
    
    def uploading(self,request):
        if request.method == "POST":
            if request.headers.get('upload_resume'):
                rawfile = request.data
                # files = request.get_data()
                # files = request.stream
                filesize = int(request.headers.get('upload_totalsize'))
                filename = urllib.parse.unquote(request.headers.get('upload_name'))
                file = os.path.join(os.getcwd() + self.upload_folder,filename);
                with open(file,'ab') as f:
                    f.write(rawfile)
                f.close()
                if filesize==os.path.getsize(file):
                    return '{"status":"success"}'
                else:
                    return str(len(rawfile))
            else:
                try:
                    file = request.files['file']
                    if file and self.allowed_file(file.filename):
                        filename = secure_filename(file.filename)
                        upload = os.path.join(os.getcwd() + self.upload_folder)
                        if not os.path.exists(upload):
                            os.makedirs(upload)
                        path = os.path.join(upload, filename)
                        file.save(path)
                    else:
                        return '{"status":"error","reason":"file type is forbidden"}'
                    return '{"status":"success"}'
                except Exception as e:
                    return '{"status":"error","reason":"server gets an error"}'

        if request.method == "GET":
            size = int(request.args.get('size'))
            file = os.path.join(os.getcwd() + self.upload_folder,request.args.get('name'));
            if os.path.exists(file):
                if os.path.getsize(file)==size:
                    return '{"status":"error","reason":"exists"}'
                else:
                    return '{"size":"'+str(os.path.getsize(file))+'"}'
            else:
                return '{"size":"0"}'

@app.route('/')
def index():
    return render_template('FileUpload.html')

fileupload = FileUpload(UPLOAD_FOLDER)
@app.route('/upload', methods=['POST','GET'])
def upload():
    # sleep(2)
    return fileupload.uploading(request)
if __name__ == '__main__':
    app.run()