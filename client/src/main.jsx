import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { persistor, store } from '../src/redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
       <App />
  </PersistGate> 
  </Provider>
);