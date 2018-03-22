import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import configureStore from './configureStore'
import registerServiceWorker from './registerServiceWorker';

const store = configureStore()

ReactDOM.render(
		<App store={store}/>,
	document.getElementById('root')
);
registerServiceWorker();
