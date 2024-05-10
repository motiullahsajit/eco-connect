from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from bson import ObjectId
import datetime

app = Flask(__name__)

app.config["MONGO_URI"] = "mongodb://localhost:27017/citizen_engagement"
app.config["JWT_SECRET_KEY"] = "627513875128732"

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
@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
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

# 3.3.1 Issue Reporting

@app.route('/issues', methods=['GET'])
@jwt_required()
def view_issues():
    current_user_id = get_jwt_identity()
    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})

    if user and user.get('is_admin', False):
        issues = list(mongo.db.issues.find({}))
        return jsonify(issues), 200
    else:
        return jsonify({'msg': 'Unauthorized'}), 403

@app.route('/issues', methods=['POST'])
@jwt_required()
def create_issue():
    current_user_id = get_jwt_identity()
    data = request.json
    issue = {
        'type': data.get('type', ''),
        'details': data.get('details', ''),
        'picture_url': data.get('picture_url', ''),
        'location': data.get('location', ''),
        'hide_user': data.get('hide_user', False),
        'created_by': current_user_id,
        'is_solved': False,
        'created_at': datetime.datetime.utcnow()
    }

    mongo.db.issues.insert_one(issue)
    return jsonify({'message': 'Issue created'}), 201

# 3.3.2 Notification System

@app.route('/notifications', methods=['GET'])
@jwt_required()
def view_notifications():
    notifications = list(mongo.db.notifications.find({}))
    return jsonify({'total_notifications': len(notifications), 'notifications': notifications}), 200

@app.route('/notifications/preferences', methods=['POST'])
@jwt_required()
def set_notification_preferences():
    current_user_id = get_jwt_identity()
    data = request.json

    mongo.db.users.update_one(
        {'_id': ObjectId(current_user_id)},
        {'$set': {'notification_preferences': data.get('categories', [])}}
    )

    return jsonify({'message': 'Notification preferences set successfully'}), 201

@app.route('/notifications', methods=['POST'])
@jwt_required()
def add_notification():
    current_user_id = get_jwt_identity()
    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})

    if not user or not user.get('is_admin', False):
        return jsonify({'msg': 'Unauthorized'}), 403

    data = request.json
    notification = {
        'title': data.get('title', ''),
        'message': data.get('message', ''),
        'category': data.get('category', ''),
        'created_at': datetime.datetime.utcnow()
    }

    mongo.db.notifications.insert_one(notification)
    return jsonify({'message': 'Notification created successfully'}), 201

# 3.3.3 Community Engagement

@app.route('/blogs', methods=['GET'])
@jwt_required()
def view_blogs():
    blogs = list(mongo.db.blogs.find({}))
    return jsonify({'blogs': blogs}), 200

@app.route('/blogs', methods=['POST'])
@jwt_required()
def create_blog():
    current_user_id = get_jwt_identity()
    data = request.json
    blog = {
        'picture_url': data.get('picture_url', ''),
        'details': data.get('details', ''),
        'tags': data.get('tags', []),
        'by_admin': False,
        'created_by': current_user_id,
        'created_at': datetime.datetime.utcnow()
    }

    mongo.db.blogs.insert_one(blog)
    return jsonify({'message': 'Blog post created successfully'}), 201

@app.route('/blogs/<post_id>', methods=['DELETE'])
@jwt_required()
def delete_blog(post_id):
    current_user_id = get_jwt_identity()
    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})

    if not user or not user.get('is_admin', False):
        return jsonify({'msg': 'Unauthorized'}), 403

    result = mongo.db.blogs.delete_one({'_id': ObjectId(post_id)})

    if result.deleted_count == 0:
        return jsonify({'msg': 'Blog post not found'}), 404

    return jsonify({'message': 'Blog post deleted successfully'}), 200

# 3.3.4 Social Sharing and Educational Content

@app.route('/events', methods=['GET'])
@jwt_required()
def get_all_events():
    events = list(mongo.db.events.find({}))
    return jsonify({'events': events}), 200

@app.route('/events', methods=['POST'])
@jwt_required()
def create_event():
    current_user_id = get_jwt_identity()
    data = request.json
    event = {
        'title': data.get('title', ''),
        'description': data.get('description', ''),
        'date': data.get('date', ''),
        'location': data.get('location', ''),
        'by_admin': False,
        'created_by': current_user_id,
        'created_at': datetime.datetime.utcnow()
    }

    mongo.db.events.insert_one(event)
    return jsonify({'message': 'Event created successfully'}), 201

@app.route('/events/<event_id>/register', methods=['POST'])
@jwt_required()
def register_for_event(event_id):
    current_user_id = get_jwt_identity()
    event = mongo.db.events.find_one({'_id': ObjectId(event_id)})

    if not event:
        return jsonify({'msg': 'Event not found'}), 404

    mongo.db.users.update_one(
        {'_id': ObjectId(current_user_id)},
        {'$addToSet': {'registered_events': event_id}}
    )

    return jsonify({'message': 'Successfully registered for the event'}), 201

@app.route('/events/<event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    current_user_id = get_jwt_identity()
    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})

    if not user or not user.get('is_admin', False):
        return jsonify({'msg': 'Unauthorized'}), 403

    result = mongo.db.events.delete_one({'_id': ObjectId(event_id)})

    if result.deleted_count == 0:
        return jsonify({'msg': 'Event not found'}), 404

    return jsonify({'message': 'Event deleted successfully'}), 200

@app.route('/quizzes', methods=['POST'])
@jwt_required()
def create_quiz():
    current_user_id = get_jwt_identity()
    data = request.json
    quiz = {
        'title': data.get('title', ''),
        'description': data.get('description', ''),
        'questions': data.get('questions', []),
        'created_by': current_user_id,
        'created_at': datetime.datetime.utcnow()
    }

    mongo.db.quizzes.insert_one(quiz)
    return jsonify({'message': 'Quiz created successfully'}), 201

@app.route('/quizzes/<quiz_id>/submit', methods=['POST'])
@jwt_required()
def submit_quiz_answers(quiz_id):
    current_user_id = get_jwt_identity()
    data = request.json
    answers = data.get('answers', [])
    correct_answers = 0
    quiz = mongo.db.quizzes.find_one({'_id': ObjectId(quiz_id)})

    if not quiz:
        return jsonify({'msg': 'Quiz not found'}), 404

    for answer in answers:
        question = next((q for q in quiz['questions'] if q['_id'] == answer['question_id']), None)
        if question and question['correct_answer'] == answer['selected_option']:
            correct_answers += 1

    return jsonify({'score': correct_answers, 'total': len(answers), 'message': 'Quiz submitted successfully'}), 200

# 3.3.5 Interactive Maps

@app.route('/maps/recycling-facilities', methods=['GET'])
@jwt_required()
def get_nearby_recycling_facilities():
    facilities = list(mongo.db.recycling_facilities.find({}))
    return jsonify({'recycling_facilities': facilities}), 200

@app.route('/maps/drop-off-points', methods=['GET'])
@jwt_required()
def get_nearby_drop_off_points():
    drop_off_points = list(mongo.db.drop_off_points.find({}))
    return jsonify({'drop_off_points': drop_off_points}), 200

@app.route('/maps/waste-management-centers', methods=['GET'])
@jwt_required()
def get_waste_management_centers():
    centers = list(mongo.db.waste_management_centers.find({}))
    return jsonify({'waste_management_centers': centers}), 200

# 3.3.6 Volunteer Opportunities

@app.route('/volunteers/events', methods=['GET'])
@jwt_required()
def get_all_volunteer_events():
    events = list(mongo.db.volunteer_events.find({}))
    return jsonify({'events': events}), 200

@app.route('/volunteers/events', methods=['POST'])
@jwt_required()
def create_volunteer_event():
    current_user_id = get_jwt_identity()
    data = request.json
    event = {
        'title': data.get('title', ''),
        'description': data.get('description', ''),
        'date': data.get('date', ''),
        'location': data.get('location', ''),
        'created_by': current_user_id,
        'created_at': datetime.datetime.utcnow()
    }

    mongo.db.volunteer_events.insert_one(event)
    return jsonify({'message': 'Volunteer event created successfully'}), 201

@app.route('/volunteers/events/<event_id>/register', methods=['POST'])
@jwt_required()
def register_for_volunteer_event(event_id):
    current_user_id = get_jwt_identity()
    event = mongo.db.volunteer_events.find_one({'_id': ObjectId(event_id)})

    if not event:
        return jsonify({'msg': 'Event not found'}), 404

    mongo.db.users.update_one(
        {'_id': ObjectId(current_user_id)},
        {'$addToSet': {'registered_volunteer_events': event_id}}
    )

    return jsonify({'message': 'Successfully registered for the event'}), 201

@app.route('/volunteers/events/<event_id>', methods=['DELETE'])
@jwt_required()
def delete_volunteer_event(event_id):
    current_user_id = get_jwt_identity()
    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})

    if not user or not user.get('is_admin', False):
        return jsonify({'msg': 'Unauthorized'}), 403

    result = mongo.db.volunteer_events.delete_one({'_id': ObjectId(event_id)})

    if result.deleted_count == 0:
        return jsonify({'msg': 'Event not found'}), 404

    return jsonify({'message': 'Volunteer event deleted successfully'}), 200

# 3.3.7 Accessibility and Multilingual Support

@app.route('/languages', methods=['GET'])
@jwt_required()
def get_supported_languages():
    languages = list(mongo.db.languages.find({}))
    return jsonify({'languages': languages}), 200

@app.route('/languages/preference', methods=['PUT'])
@jwt_required()
def set_user_language_preference():
    current_user_id = get_jwt_identity()
    data = request.json

    mongo.db.users.update_one(
        {'_id': ObjectId(current_user_id)},
        {'$set': {'language_preference': data.get('language_code', 'en')}}
    )

    return jsonify({'message': 'Language preference updated successfully'}), 200

@app.route('/accessibility', methods=['GET'])
@jwt_required()
def get_accessibility_settings():
    current_user_id = get_jwt_identity()
    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})

    if not user:
        return jsonify({'msg': 'Unauthorized'}), 403

    return jsonify({
        'accessibility_settings': {
            'high_contrast_mode': user.get('high_contrast_mode', False),
            'text_to_speech_enabled': user.get('text_to_speech_enabled', False),
            'font_size': user.get('font_size', 'medium')
        }
    }), 200

@app.route('/accessibility', methods=['PUT'])
@jwt_required()
def update_accessibility_settings():
    current_user_id = get_jwt_identity()
    data = request.json

    mongo.db.users.update_one(
        {'_id': ObjectId(current_user_id)},
        {
            '$set': {
                'high_contrast_mode': data.get('high_contrast_mode', False),
                'text_to_speech_enabled': data.get('text_to_speech_enabled', False),
                'font_size': data.get('font_size', 'medium')
            }
        }
    )

    return jsonify({'message': 'Accessibility settings updated successfully'}), 200

# 3.3.8 Privacy and Security

@app.route('/privacy', methods=['GET'])
@jwt_required()
def get_privacy_settings():
    current_user_id = get_jwt_identity()
    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})

    if not user:
        return jsonify({'msg': 'Unauthorized'}), 403

    return jsonify({
        'privacy_settings': {
            'profile_visibility': user.get('profile_visibility', 'public'),
            'activity_visibility': user.get('activity_visibility', 'public')
        }
    }), 200

@app.route('/privacy', methods=['PUT'])
@jwt_required()
def update_privacy_settings():
    current_user_id = get_jwt_identity()
    data = request.json

    mongo.db.users.update_one(
        {'_id': ObjectId(current_user_id)},
        {
            '$set': {
                'profile_visibility': data.get('profile_visibility', 'public'),
                'activity_visibility': data.get('activity_visibility', 'public')
            }
        }
    )

    return jsonify({'message': 'Privacy settings updated successfully'}), 200

@app.route('/friends/request', methods=['POST'])
@jwt_required()
def send_friend_request():
    current_user_id = get_jwt_identity()
    data = request.json
    friend_id = data.get('friend_id', '')

    if not friend_id or not mongo.db.users.find_one({'_id': ObjectId(friend_id)}):
        return jsonify({'msg': 'Invalid friend ID'}), 400

    result = mongo.db.users.update_one(
        {'_id': ObjectId(friend_id)},
        {'$addToSet': {'friend_requests': current_user_id}}
    )

    if result.matched_count == 0:
        return jsonify({'msg': 'Friend not found'}), 404

    return jsonify({'message': 'Friend request sent successfully'}), 201

@app.route('/friends/accept', methods=['POST'])
@jwt_required()
def accept_friend_request():
    current_user_id = get_jwt_identity()
    data = request.json
    friend_id = data.get('friend_id', '')

    if not friend_id or not mongo.db.users.find_one({'_id': ObjectId(friend_id)}):
        return jsonify({'msg': 'Invalid friend ID'}), 400

    result_1 = mongo.db.users.update_one(
        {'_id': ObjectId(current_user_id)},
        {
            '$addToSet': {'friends': friend_id},
            '$pull': {'friend_requests': friend_id}
        }
    )

    result_2 = mongo.db.users.update_one(
        {'_id': ObjectId(friend_id)},
        {'$addToSet': {'friends': current_user_id}}
    )

    if result_1.matched_count == 0 or result_2.matched_count == 0:
        return jsonify({'msg': 'Friend not found'}), 404

    return jsonify({'message': 'Friend request accepted successfully'}), 200

@app.route('/friends/<friend_id>', methods=['DELETE'])
@jwt_required()
def remove_friend(friend_id):
    current_user_id = get_jwt_identity()

    result_1 = mongo.db.users.update_one(
        {'_id': ObjectId(current_user_id)},
        {'$pull': {'friends': friend_id}}
    )

    result_2 = mongo.db.users.update_one(
        {'_id': ObjectId(friend_id)},
        {'$pull': {'friends': current_user_id}}
    )

    if result_1.matched_count == 0 or result_2.matched_count == 0:
        return jsonify({'msg': 'Friend not found'}), 404

    return jsonify({'message': 'Friend removed successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
