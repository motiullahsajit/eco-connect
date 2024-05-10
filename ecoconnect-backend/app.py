from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from bson import ObjectId
import datetime

app = Flask(__name__)

# Configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/citizen_engagement"
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"  # Replace with a strong secret key

# Initialize extensions
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Register Endpoint
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username', '')
    email = data.get('email', '')
    password = data.get('password', '')

    if not username or not email or not password:
        return jsonify({'message': 'Invalid data.'}), 400

    user_exists = mongo.db.users.find_one({'email': email})
    if user_exists:
        return jsonify({'message': 'User already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = {
        'username': username,
        'email': email,
        'password': hashed_password,
        'is_admin': False,
        'created_at': datetime.datetime.utcnow()
    }
    mongo.db.users.insert_one(new_user)

    return jsonify({'message': 'User registered successfully'}), 201

# Login Endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email', '')
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'message': 'Invalid credentials'}), 401

    user = mongo.db.users.find_one({'email': email})
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=str(user['_id']), expires_delta=datetime.timedelta(days=1))
    return jsonify({'access_token': access_token}), 200

# Logout Endpoint
@app.route('/logout', methods=['GET'])
@jwt_required()
def logout():
    # Implement any necessary logout logic here
    return jsonify({'message': 'User logged out successfully'}), 200

# Get User Profile Endpoint
@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})

    if not user:
        return jsonify({'message': 'User not found'}), 401

    return jsonify({
        'username': user['username'],
        'email': user['email'],
        'is_admin': user.get('is_admin', False)
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
