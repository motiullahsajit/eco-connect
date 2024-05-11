from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt, get_jwt_identity
import datetime
import os

app = Flask(__name__)

app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb+srv://untitled:oqdOLCDAfdbm4D09@cluster0.sxosl60.mongodb.net/ecosync?retryWrites=true&w=majority")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "123123")

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    token = mongo.db.blacklist.find_one({"jti": jti})
    return token is not None

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()

    name = data.get('name', '').strip() or ""
    phoneNumber = data.get('phoneNumber', '').strip() or ""
    photoUrl = data.get('photoUrl', '').strip() or ""
    role = "user"

    if not username or not email or not password:
        return jsonify({'message': 'Missing required fields.'}), 400

    user_exists = mongo.db.users.find_one({'email': email})
    if user_exists:
        return jsonify({'message': 'User already exists'}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = {
        'username': username,
        'email': email,
        'password': hashed_password,
        'name': name,
        'phoneNumber': phoneNumber,
        'photoUrl': photoUrl,
        'role': role,
        'created_at': datetime.datetime.utcnow()
    }
    user_id = mongo.db.users.insert_one(new_user).inserted_id

    access_token = create_access_token(identity=str(user_id), expires_delta=datetime.timedelta(days=1))

    return jsonify({
            'username': username,
            'email': email,
            'name': name,
            'phoneNumber': phoneNumber,
            'photoUrl': photoUrl,
            'role': role,
            'access_token': access_token
    }), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()

    if not email or not password:
        return jsonify({'message': 'Invalid credentials'}), 401

    user = mongo.db.users.find_one({'email': email})
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=str(user['_id']), expires_delta=datetime.timedelta(days=1))

    return jsonify({
        'username': user['username'],
        'email': user['email'],
        'name': user.get('name', ''),
        'phoneNumber': user.get('phoneNumber', ''),
        'photoUrl': user.get('photoUrl', ''),
        'role': user.get('role', 'user'),
        'access_token': access_token
    }), 200

@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    mongo.db.blacklist.insert_one({"jti": jti, "timestamp": datetime.datetime.utcnow()})
    return jsonify({"message": "User logged out successfully"}), 200

@app.route('/users', methods=['GET'])
def get_users():
    users = mongo.db.users.find({}, {'password': 0})
    user_list = []
    for user in users:
        user['_id'] = str(user['_id'])
        user_list.append(user)
    return jsonify(user_list), 200

@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)}, {'password': 0})
    if not user:
        return jsonify({'message': 'User not found'}), 404
    user['_id'] = str(user['_id'])
    return jsonify(user), 200

@app.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    print(request.get_json())
    data = request.json
    update_data = {}

    # Directly extract and validate the fields
    if 'name' in data:
        update_data['name'] = data['name']
    if 'phoneNumber' in data:
        update_data['phoneNumber'] = data['phoneNumber']
    if 'photoUrl' in data:
        update_data['photoUrl'] = data['photoUrl']

    if not update_data:
        return jsonify({'message': 'No data provided for update'}), 400

    result = mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})

    if result.modified_count == 0:
        return jsonify({'message': 'No changes made'}), 304  # Using 304 Not Modified
    
    return jsonify({'message': 'Profile updated successfully'}), 200

@app.route('/threads', methods=['POST'])
@jwt_required()
def create_thread():
    user_id = get_jwt_identity()
    data = request.json
    name = data.get('name', '').strip()
    tag = data.get('tag', '').strip()
    content = data.get('content', '').strip()
    picture_url = data.get('picture_url', '').strip()

    if not (name and tag and content and picture_url):
        return jsonify({'message': 'Missing required fields'}), 400

    new_thread = {
        'user_id': user_id,
        'name': name,
        'tag': tag,
        'content': content,
        'picture_url': picture_url,
        'created_at': datetime.datetime.utcnow()
    }
    mongo.db.threads.insert_one(new_thread)
    return jsonify({'message': 'Thread created successfully'}), 201

@app.route('/threads', methods=['GET'])
def get_threads():
    threads = mongo.db.threads.find({})
    thread_list = []
    for thread in threads:
        thread['_id'] = str(thread['_id'])
        thread_list.append(thread)
    return jsonify(thread_list), 200

if __name__ == '__main__':
    # app.run(debug=True)
    app.run(host='192.168.137.148', port=8080, debug=True)
