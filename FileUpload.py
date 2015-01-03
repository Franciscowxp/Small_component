from flask import Flask,render_template,request
from werkzeug import secure_filename
app = Flask(__name__)
app.debug = True
app.host = '127.0.0.1'

ALLOWED_EXTENSIONS = {'gif', 'png', 'jpg', 'txt', 'jpeg', 'pdf'}
UPLOAD_FOLDER = 'upload'
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('FileUpload.html')

@app.route('/upload', methods=['POST'])
def upload():
    if request.method == "POST":
        files = request.files
        key = files.keys()[0]
        value = files[key]
        print(value)
        try:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                upload = os.path.join(os.getcwd() + UPLOAD_FOLDER)
                if not os.path.exists(upload):
                    os.makedirs(upload)
                path = os.path.join(os.getcwd() + UPLOAD_FOLDER, filename)
                file.save(path)
            else:
                return '文件格式不允许'
            return "上传成功"
        except Exception as e:
            return "上传失败"

if __name__ == '__main__':
    app.run()