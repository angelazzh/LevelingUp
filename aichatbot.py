from flask import Flask, request, jsonify
import os
from openai import AzureOpenAI

client = AzureOpenAI(
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview"
)

app = Flask(__name__)

conversations = {}

@app.route('/openai', methods=['POST'])
def converse_with_chatbot():
    session_id = request.json.get('session_id', 'default_session')
    user_message = request.json.get('prompt', '')
    history = conversations.get(session_id, [])
    history.append({"role": "user", "content": user_message})
    try:
        response = client.chat.completions.create(
            model= "gpt-4o",
            messages=history, 
            max_tokens=1024,
            n=1,
            temperature=0.5
        )
        ai_message = response.choices[0].message.content
        history.append({"role": "system", "content": ai_message})
        conversations[session_id] = history

        return jsonify({'response': ai_message})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)