const WebSocket = require('ws');

const server = new WebSocket.Server({ host: '10.33.25.17', port: 8080 });

server.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log('Received:', message);
        ws.send('Hello, client');
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

console.log('WebSocket server is running on ws://10.33.25.17:8080/ws');
