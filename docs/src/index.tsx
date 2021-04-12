import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './components';
import reportWebVitals from './reportWebVitals';

import * as check from 'browser-search';
console.log('22', check.process({a: 5}));
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
