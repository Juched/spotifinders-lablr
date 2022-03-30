# compose_flask/app.py
import os
import json
from flask import Flask, render_template, session, request, redirect, send_file
from flask_sock import Sock


app = Flask(__name__)
sock = Sock(app)

REDIR = os.environ['REDIR']

SENTENCES = []

with open('dialogues_text.txt', 'r') as f:
    text = f.read()
    text = text.replace('\n', '')
    temp = text.split('__eou__')
    for x in temp:
        if x != '':
            SENTENCES.append(x)

MAPPINGS = {}

@app.before_request
def before_request():
    if 'localhost' not in REDIR:
        scheme = request.headers.get('X-Forwarded-Proto')
        if scheme and scheme == 'http' and request.url.startswith('http://'):
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)
    else:
        return 

@app.route('/')
def index():    
    sen = SENTENCES.pop()
    return render_template('index.html', sentence=sen)

@app.route('/save', methods=['POST'])
def save():
    content = json.loads(request.data)
    print("Save: ")
    print(content)
    MAPPINGS[content['sentence']] = content['values']
    return "True"

@app.route('/disconnect', methods=['POST'])
def disconnect():
    content = json.loads(request.data)
    print("Disconnect: ")
    print(content)
    SENTENCES.append(content['sentence'])
    return "True"

@app.route('/download')
def download():
    print("Trying to download")
    with open("outputs/output.txt", 'w') as f:
        f.write(json.dumps(MAPPINGS))
    return send_file('outputs/output.txt',attachment_filename='out.txt', as_attachment=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
