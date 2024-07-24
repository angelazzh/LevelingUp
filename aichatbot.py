from flask import Flask, request, jsonify, session
from dotenv import load_dotenv, find_dotenv
import os
from openai import AzureOpenAI
from pymongo import MongoClient
from bson import ObjectId

load_dotenv(find_dotenv())

uri = os.getenv("DSN")
client = MongoClient(uri)
db = client['final_project']
routines = db['routines']
goals = db['goals']

client = AzureOpenAI(
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview"
)

app = Flask(__name__)

app.secret_key = os.getenv("FLASK_SECRET")

conversations = {}

@app.route('/openai', methods=['POST'])
def converse_with_chatbot():
    data = request.get_json()
    session_id = data.get('session_id', 'default_session')
    user_message = data.get('prompt', '')
    user_id = data.get('user_id', None)

    if session_id not in session or 'user_routines' not in session[session_id]:
        if user_id:
            session[session_id] = {
                'user_routines': fetch_user_routines(user_id),
                'user_goals': fetch_user_goals(user_id)
            }
        else:
            return jsonify({'error': 'User ID is required for fetching data'}), 400
    
    user_routines = session[session_id]['user_routines']
    user_goals = session[session_id]['user_goals']

    history = conversations.get(session_id, [
        {"role": "system", "content": "You are a fitness personal trainer. You are only here to answer questions about health and fitness, help the user improve their fitness plans, and provide personalized fitness coaching. If the user asks any unrelated questions, please inform them your limits as a personal gymbot."},
        {"role": "system", "content": user_routines},
        {"role": "system", "content": user_goals}
    ])    
    history.append({"role": "user", "content": user_message})

    try:
        ai_message = generate_response_from_ai(history)
    except Exception as e:
        app.logger.error(f"Error processing the user input: {str(e)}")
        return jsonify({'error': 'Failed to process your request'}), 500

    history.append({"role": "assistant", "content": ai_message})
    conversations[session_id] = history
    return jsonify({'response': ai_message})

def generate_response_from_ai(history):
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=history,
            max_tokens=1024,
            n=1,
            temperature=0.5
        )
        return response.choices[0].message.content
    except Exception as e:
        app.logger.error(f"Failed to communicate with OpenAI: {str(e)}")
        raise

def fetch_user_routines(user_id):
    user_routines = routines.find({"user": ObjectId(user_id)})
    routines_info = "Your routines are: \n"
    for routine in user_routines:
            routine_name = routine['name'],
            if isinstance(routine_name, tuple):
                routine_name = ' '.join(routine_name)
            if routine_name.endswith(','):
                routine_name = routine_name[:-1]
            routines_info += f"Routine Name: {routine_name}\n"
            for exercise in routine['exercises']:
                ex_name = exercise['exerciseName']
                sets = exercise['sets']
                reps = exercise['reps']
                routines_info += f"  Exercise: {ex_name}, Sets: {sets}, Reps: {reps}\n"
            routines_info += "\n"
    return routines_info.strip()

def fetch_user_goals(user_id):
    user_goals = goals.find({"user": ObjectId(user_id)})
    goals_info = "Your goals are: \n"
    for goal in user_goals:
        description = goal['description']
        target_date = goal['targetDate']
        completed = 'Completed' if goal['completed'] else 'Not Completed'  
        goals_info += f"Description: {description}\n"
        goals_info += f"Target Date: {target_date}\n"
        goals_info += f"Status: {completed}\n\n"
    return goals_info.strip() 

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)