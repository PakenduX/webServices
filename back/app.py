#!flask/bin/python
from flask import Flask, request, jsonify
import sys
from flask_cors import CORS
import numpy as np
import arxiv
from flask_pymongo import PyMongo
import json

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config["MONGO_URI"] = "mongodb://127.0.0.1:27017/webServices"
mongo = PyMongo(app)

@app.route('/', methods=['POST'])
def compute():
    typeOfSearch = request.json['typeOfSearch']
    result = arxiv.query(query=request.json['search'], max_chunk_results=10)
    finalResult = []
    #print(result[0], file=sys.stdout)
    for paper in result:
        if typeOfSearch == 'generalSearchChecked':
            finalResult.append(paper)
            mongo.db.publications.insert_many([{
                'id': paper.id, 
                'summary': paper.summary, 
                'authors': paper.authors, 
                'author': paper.author,
                'pdf_url': paper.pdf_url
            }])
        elif typeOfSearch == 'searchCoAuthorsChecked':
            if paper.author == request.json['search']:
                finalResult.append({
                    author: paper.author,
                    authors: paper.authors
                })
        else:
            if paper.author == request.json['search']:
                finalResult.append({
                    author: paper.author,
                    authors: paper.authors
                })
    return jsonify({ 'result': finalResult})
    
if __name__ == '__main__':
    app.run(debug=True)