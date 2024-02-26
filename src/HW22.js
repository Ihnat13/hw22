import './index.css';

const modal = document.getElementById('myModal');
const nicknameInput = document.getElementById('nickname-input');
const joinButton = document.getElementById('join-btn');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const ws = new WebSocket(`ws://${location.host}`)
let nickname;
joinButton.addEventListener('click', () => {
    nickname = nicknameInput.value.trim();
    if (nickname !== '') {
        modal.style.display = 'none';
        // ws.send(JSON.stringify({
        //     type: `nickname`,
        //     nickname: nickname,

        // }
        // ))
    }else{
        nickname = `anonymous`;
        modal.style.display = 'none';
        // ws.send(JSON.stringify({
        //     type: `nickname`,
        //     nickname: nickname
        // }))
    }
    
    
    ws.onopen = () => {
        console.log(`connect`)
    }
});

sendButton.addEventListener('click', () => {
    sendMessage(nickname);
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage(nickname) {
    const message = messageInput.value.trim();
    if (message !== '') {
        ws.send(JSON.stringify({name: nickname, message }))
        const createDiv = document.createElement('div');
        createDiv.textContent = `${nickname}: ${message}`;
        chatBox.appendChild(createDiv);
        messageInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
ws.onmessage = ({data}) => {
    const dataMsg = JSON.parse({data}.data);
    const createDiv = document.createElement('div');
    createDiv.textContent = `${dataMsg.name}: ${dataMsg.message}`;
    chatBox.appendChild(createDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
ws.onclose = () => {
    console.log(`discon`)
}
window.addEventListener('load', () => {
    modal.style.display = 'block';
});

