import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserSearchProvider } from '@browser-search/react-browser-search';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { store } from './redux';
import './index.css';
import { PersonPage } from './pages';
import reportWebVitals from './reportWebVitals';

const theme = createTheme();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserSearchProvider>
        <ThemeProvider theme={theme}>
          <PersonPage />
        </ThemeProvider>
      </BrowserSearchProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
