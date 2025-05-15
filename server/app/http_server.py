from flask import Flask
app = Flask(__name__)


class HttpServer():
    def __init__(self):
        pass

    
def index(username):
    return "Hello, %s!" % username

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8764)
