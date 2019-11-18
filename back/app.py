#!flask/bin/python
from flask import Flask, request, jsonify
from flask_cors import CORS
import arxiv
from flask_pymongo import PyMongo
import requests as req

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config["MONGO_URI"] = "mongodb://127.0.0.1:27017/webServices"
mongo = PyMongo(app)

@app.route('/arxiv', methods=['POST'])
def arxivSearch():
    typeOfSearch = request.json['typeOfSearch']
    result = arxiv.query(
        query=request.json['search'],
        max_chunk_results=10,
        max_results=10
    )
    finalResult = []
    #print(result[0], file=sys.stdout)
    for paper in result:
        #if typeOfSearch == 'generalSearchChecked':
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
        #else: #typeOfSearch == 'searchCoAuthorsChecked':
            #if paper.author == request.json['search']:
                #finalResult.append(paper)
        """else:
            if paper.author == request.json['search']:
                finalResult.append({
                    author: paper.author,
                    authors: paper.authors
                })"""
    return jsonify({ 'result': finalResult})

@app.route('/hal', methods=['POST'])
def halSearch():
    url = 'https://api.archives-ouvertes.fr/search/?q=' + request.json['search'] + '&wt=json'
    response = req.get(url)
    return response.json()
    
if __name__ == '__main__':
    app.run(debug=True)