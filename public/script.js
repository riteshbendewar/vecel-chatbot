async function askQuestion() {
  let questionInput = document.getElementById('user-input');
  let question = questionInput.value;
  questionInput.value = '';

  displayMessage('You', question, 'user-message');

  
  let typingMessageElement = displayTypingMessage('typing...');

  const response = await fetch('/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question })
  });

  const data = await response.json();

  setTimeout(() => {
    
    removeMessage(typingMessageElement);

    
    displayMessage('Chatbot', data.answer, 'chatbot-message');
  }, 2000); 
}

function displayMessage(sender, message, className) {
  const chatBox = document.getElementById('chat-body');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', className);
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function displayTypingMessage(message) {
  const chatBox = document.getElementById('chat-body');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', 'typing-message');
  messageElement.innerHTML = `<strong>Chatbot:</strong> ${message}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;

  
  return messageElement;
}

function removeMessage(messageElement) {
  messageElement.remove();
}

function closeChatbot() {
  
  const chatBox = document.getElementById('chat-body');

  document.getElementById('chat-container').style.display = 'none';
  chatBox.innerHTML="";
}

function toggleChatbot() {
  const chatContainer = document.getElementById('chat-container');
  if (chatContainer.style.display === 'none' || chatContainer.style.display === '') {
    chatContainer.style.display = 'flex';
    chatContainer.style.flexDirection='column'
  } else {
    chatContainer.style.display = 'none';
  }
}

let questionInput = document.getElementById('user-input');

questionInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    askQuestion();
  }
});
