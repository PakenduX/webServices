#!flask/bin/python
from flask import Flask, request, jsonify
from flask_cors import CORS
import arxiv
from flask_pymongo import PyMongo
import requests as req
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token
from flask_bcrypt import Bcrypt
import datetime
from models.UserSchema import validate_user
from secrets import token_hex
from bson.json_util import dumps, loads

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config["MONGO_URI"] = "mongodb://127.0.0.1:27017/webServices"
app.config['JWT_SECRET_KEY'] = 'WEBSERVICES_S3CR3T'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
mongo = PyMongo(app)
jwt = JWTManager(app)
flask_bcrypt = Bcrypt(app)

@app.route('/arxiv', methods=['POST'])
def arxivSearch():
    token = request.json['token']
    user = mongo.db.users.find_one({'access_token': token})
    if not user:
        return jsonify({
            'status': 'error',
            'message': 'Invalid token'
        })
    elif  user['nb_req'] <= 8 :
        result = arxiv.query(
            query=request.json['search'],
            max_chunk_results=10,
            max_results=10
        )
        finalResult = []
        #print(result[0], file=sys.stdout)
        for paper in result:
            finalResult.append(paper)
            mongo.db.publications.insert_many([{
                'id': paper.id,
                'summary': paper.summary,
                'authors': paper.authors,
                'author': paper.author,
                'pdf_url': paper.pdf_url,
                'title': paper.title,
                'arxiv_comment': paper.arxiv_comment
            }])

        mongo.db.users.update_one(
            {"_id" : user['_id']},
            {"$set": {"nb_req" : user['nb_req'] + 1 }}, upsert=True
        )
        return jsonify({ 'result': finalResult})
    else:
        return jsonify({
            'status': 'error',
            'message': 'You have reached the maximum request, buy now'
        })

@app.route('/hal', methods=['POST'])
def halSearch():
    token = request.json['token']
    user = mongo.db.users.find_one({'access_token': token})
    if not user:
        return jsonify({
            'status': 'error',
            'message': 'Invalid token'
        })
    elif  user['nb_req'] <= 9 :
        url = 'https://api.archives-ouvertes.fr/search/?q=' + request.json['search'] + '&wt=json'
        response = req.get(url)
        mongo.db.users.update_one(
            {"_id" : user['_id']},
            {"$set": {"nb_req" : user['nb_req'] + 1 }}, upsert=True
        )
        return response.json()
    else:
        return jsonify({
            'status': 'error',
            'message': 'You have reached the maximum request, buy now'
        })

@app.route('/register', methods=['POST'])
def register():
    data = validate_user(request.get_json())
    if data['ok']:
        data = data['data']
        access_token = token_hex(25)
        data['access_token'] = access_token
        data['password'] = flask_bcrypt.generate_password_hash(data['password'])
        data['nb_req'] = 0
        mongo.db.users.insert_one(data)
        return jsonify({
            'ok': True,
            'message': 'User created successfully!',
            'access_token' : access_token
        }), 200
    else:
        return jsonify({
            'ok': False,
            'message': 'Bad request parameters: {}'.format(data['message'])
        }), 400

@app.route('/login', methods=['POST'])
def login():
    data = validate_user(request.get_json())
    if data['ok']:
        data = data['data']
        user = mongo.db.users.find_one({'email': data['email']})
        if user and flask_bcrypt.check_password_hash(user['password'], data['password']):
            del user['password']
            access_token = create_access_token(identity=data)
            user['token'] = access_token
            return jsonify({'ok': True, 'data': dumps(user)}), 200
        else:
            return jsonify({'ok': False, 'message': 'invalid username or password'}), 401
    else:
        return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400

if __name__ == '__main__':
    app.run(debug=True)