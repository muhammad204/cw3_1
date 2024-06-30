import { createApp } from 'vue';
import App from './App.vue';
import '../public/css/bootstrap.css';
import '../public/css/bootstrap.min.css';
import '../public/css/style.css';

// WebSocket client code
const socket = new WebSocket('ws://10.33.25.17:8080/ws');

socket.onopen = () => {
    console.log('WebSocket is open now.');
};

socket.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
};

socket.onerror = (error) => {
    console.error('WebSocket error observed:', error);
};

socket.onclose = () => {
    console.log('WebSocket is closed now.');
};

createApp(App).mount('#app');
