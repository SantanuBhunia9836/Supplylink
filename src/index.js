import React from 'react';
import ReactDOM from 'react-dom/client';
// ... existing code ...
import './styles/index.css'; // Corrected path
import App from './App';
import reportWebVitals from './reportWebVitals';
// ... existing code ...

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function

// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
