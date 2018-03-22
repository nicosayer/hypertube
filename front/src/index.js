import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App';
import configureStore from './configureStore'
import registerServiceWorker from './registerServiceWorker';

const store = configureStore()

ReactDOM.render(
	<Router>
		<App store={store}/>
	</Router>,
	document.getElementById('root')
);
registerServiceWorker();
