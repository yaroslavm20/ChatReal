const wsULR = 'ws://localhost:3000';
const chat = document.getElementById('chat');
const input = document.getElementById('message');
const button = document.getElementById('send');
const notify = new Audio('assets/notify.mp3');

let id = null;
let ws;
button.disabled = true;

function connect() {
    ws = new WebSocket(wsULR);

    ws.onopen = () => {
        console.log('Connected to the server');
        button.disabled = false;
    };

    ws.onmessage = (event) => {
        const message = document.createElement('div');

        console.log('Received:', event.data);
        const data = JSON.parse(event.data);

        if (data.type === 'system') {
            if (data.id && !id) {
                id = data.id;
            }
            message.innerText = data.message;
        }
        else if (data.type === 'user') {
            message.innerText = `User ${data.id}: ${data.message}`;
        }

        chat.appendChild(message);

        //Функція сповіщення про нове повідомлення
        if (document.hidden) {
            notify.play();
        }
    };

    ws.onclose = () => {
        console.log('Disconnected from the server');
        button.disabled = true;
        setTimeout(connect, 3000);
    };

    ws.onerror = (error) => {
        console.error('Error:', error.message);
    };
}

button.onclick = () => {
    if (ws.readyState === WebSocket.OPEN) {
        const message = input.value;
        ws.send(JSON.stringify({ id, message: message }));
        input.value = '';
    }
    else {
        console.error('WebSocket is not open. ReadyState:', ws.readyState);
    }
};

connect();