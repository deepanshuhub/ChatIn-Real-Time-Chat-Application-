const socket = io();
let username;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');
const pingSound = document.getElementById('pingSound');

do {
    username = prompt('Please enter your name: ');
} while (!username);

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Modify to send on Enter key press only (without Shift key)
        e.preventDefault(); // Prevents the newline character from being inserted
        sendMessage(e.target.value);
    }
});

// Update the send button event listener
const sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', () => {
    sendMessage(textarea.value);
});

function sendMessage(message) {
    let msg = {
        user: username,
        message: message.trim()
    };
    // Append
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    textarea.style.height = ''; // Reset the textarea height
    scrollToBottom();

    // Send to server
    socket.emit('message', msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);

    // Play sound ping on incoming message
    if (type === 'incoming') {
        pingSound.play();
    }
}

// Receive messages
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Update textarea height dynamically based on content
textarea.addEventListener('input', () => {
    textarea.style.height = ''; // Reset the textarea height
    textarea.style.height = `${textarea.scrollHeight}px`;
});
