function getSessionId() {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
}

function generateSessionId() {
    return 'sess-' + Math.random().toString(36).substring(2, 9);
}

document.addEventListener('DOMContentLoaded', function() {
    displayMessage("Hello! I am your personal fitness trainer. How can I assist you today?", 'ai');
});

document.getElementById('aiForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const prompt = document.getElementById('prompt').value;
    if (prompt.trim() === '') return; 
    displayMessage(prompt, 'user');
    document.getElementById('prompt').value = ''; 

    showTypingIndicator();

    const sessionId = getSessionId();

    fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId, prompt: prompt })
    })
    .then(response => response.json())
    .then(data => {
        removeTypingIndicator();
        displayMessage(data.response, 'ai');
    })
    .catch(error => {
        console.error('Error:', error);
        removeTypingIndicator();
    });
});

function showTypingIndicator() {
    const chatbox = document.getElementById('chatbox');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.classList.add('chat-message');
    typingDiv.innerHTML = '<img src="images/typing.gif" alt="Typing..." class= "typing-indicator" />'; 
    chatbox.appendChild(typingDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.parentNode.removeChild(typingIndicator);
    }
}

function displayMessage(message, author) {
    const chatbox = document.getElementById('chatbox');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.classList.add('chat-message', author === 'user' ? 'user-message' : 'ai-message');
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}