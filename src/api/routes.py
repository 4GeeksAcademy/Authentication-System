"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import hashlib

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email == None or password == None:
        return jsonify({"msg": "Bad email or password"}), 401

    search_user= User.query.filter_by(email=email).one_or_none()
    if search_user == None:
        return jsonify({ "message" : "user not found "}), 404
    if search_user.password == hashlib.md5(password.encode('utf-8') ).hexdigest():
        return jsonify({ "token": create_access_token(identity=search_user.email), "user": search_user.serialize() }), 200
    return jsonify({ "message" : "password doesn't match! "}), 401

@api.route('/signup', methods=['POST'])
def register():
    body = request.json

    if "email" not in body:
        return jsonify({"message": "Error, asegúrate de enviar 'email' en el body"}), 400
    if "password" not in body:
        return jsonify({"message": "Error, asegúrate de enviar 'password' en el body"}), 400
    
    try:
        hashed_password = hashlib.md5( body['password'].encode('utf-8') ).hexdigest()
        nuevo_user = User(body['email'], hashed_password)
        db.session.add(nuevo_user)
        db.session.commit()

        return jsonify(nuevo_user.serialize()), 200
    except Exception as err:
        return jsonify({"message": err}), 500
    
@api.route('/users', methods=['GET'])
def get_all_users():
    all_users = User.query.all()
    if all_users is not None:
        return jsonify([user.serialize() for user in all_users]), 200
    else:
        return jsonify({"message": "Users not found"}), 404
    

@api.route('/user/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if user is not None:
        return jsonify(user.serialize()), 200
    else:
        return jsonify({"message": "user not found"}), 404    

