const express = require('express');
const webSoket = require('ws');
const http = require('http');

const app = express();
const PORT = 3000;

const server = http.createServer(app);

const wss = new webSoket.Server({ server });

const clients = [];
wss.on('connection', (ws) => {
    console.log('New client connected');

    const id = clients.length;
    clients.push({ id, ws });

    clients.forEach(client => {
        if (client.ws.readyState === webSoket.OPEN) {
            client.ws.send(JSON.stringify({ type: 'system', id, message: 'User ' + id + ' connected to the chat.' }));
        }
    });

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);

        clients.forEach(client => {
            if (client.ws.readyState === webSoket.OPEN) {
                client.ws.send(JSON.stringify({ type: 'user', id, message: parsedMessage.message.toString() }));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');

        clients.forEach(clients => {
            if (clients.ws.readyState === webSoket.OPEN) {
                clients.ws.send(JSON.stringify({ type: 'system', id, message: 'User ' + id + ' disconnected from the chat.' }));
            }
        });
    });

    ws.send(JSON.stringify({ type: 'system', id, message: 'Welcome to the chat! You are user ' + id + '.' }));
});

server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});