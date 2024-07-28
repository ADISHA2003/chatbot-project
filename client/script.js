window.onload = function() {
  document.getElementById('user-input').focus();
};

document.addEventListener('keydown', (event) => {
  const userInput = document.getElementById('user-input');
  if (event.ctrlKey && event.altKey && event.key === 'i') {
    event.preventDefault();
    userInput.focus();
  }
});

document.getElementById('send-button').addEventListener('click', async () => {
  sendMessage();
});

document.getElementById('user-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

async function sendMessage() {
  const userInput = document.getElementById('user-input').value;
  if (userInput.trim() === '') return;

  const chatBox = document.getElementById('chat-box');
  const userMessage = document.createElement('div');
  userMessage.className = 'user-message';
  userMessage.textContent = userInput;
  chatBox.appendChild(userMessage);

  document.getElementById('user-input').value = '';
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userInput }),
  });

  const data = await response.json();
  const botMessage = document.createElement('div');
  botMessage.className = 'bot-message';

  // Add a placeholder for the typing animation
  const typingIndicator = document.createElement('span');
  typingIndicator.className = 'typing-indicator';
  typingIndicator.textContent = '...';
  botMessage.appendChild(typingIndicator);

  chatBox.appendChild(botMessage);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom

  // Simulate typing animation
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust delay as needed
  typingIndicator.remove(); // Remove the typing indicator

  // Display the actual response
  botMessage.innerHTML = formatBotResponse(data.response);
}

function formatBotResponse(response) {
  return response
    .replace(/```([\s\S]*?)```/g, '<pre>$1</pre>') // Code block
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Bold text
}
