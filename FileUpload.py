from flask import Flask,render_template,request
from werkzeug import secure_filename
import os
import urllib.parse
from time import sleep
app = Flask(__name__)
app.debug = True
app.host = '127.0.0.1'

ALLOWED_EXTENSIONS = {'gif', 'png', 'jpg', 'txt', 'jpeg', 'pdf','rar'}
UPLOAD_FOLDER = '/upload'
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('FileUpload.html')

@app.route('/upload', methods=['POST','GET'])
def upload():
    # sleep(2)
    if request.method == "POST":
        if request.headers.get('upload_resume'):
            rawfile = request.data
            # files = request.get_data()
            # files = request.stream
            filesize = int(request.headers.get('upload_totalsize'))
            filename = urllib.parse.unquote(request.headers.get('upload_name'))
            file = os.path.join(os.getcwd() + UPLOAD_FOLDER,filename);
            with open(file,'ab') as f:
                f.write(rawfile)
            f.close()
            if filesize==os.path.getsize(file):
                return "success"
            else:
                return str(len(rawfile))
        else:
            try:
                file = request.files['file']
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    upload = os.path.join(os.getcwd() + UPLOAD_FOLDER)
                    if not os.path.exists(upload):
                        os.makedirs(upload)
                    path = os.path.join(upload, filename)
                    file.save(path)
                else:
                    return 'file type is forbidden'
                return "success"
            except Exception as e:
                return "fail"

    if request.method == "GET":
        size = int(request.args.get('size'))
        file = os.path.join(os.getcwd() + UPLOAD_FOLDER,request.args.get('name'));
        if os.path.exists(file):
            if os.path.getsize(file)==size:
                return "exists"
            else:
                return str(os.path.getsize(file))
        else:
            return '0'

if __name__ == '__main__':
    app.run()