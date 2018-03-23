import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import configureStore from './configureStore'
import registerServiceWorker from './registerServiceWorker';

import { fetchWrap } from './services/fetchWrap'
import { logMe } from './actions/me'

const store = configureStore()
fetchWrap('/isUserLoggedIn', {
	method: 'GET',
	credentials: 'include'
})
.then((payload) => {
	//console.log(payload)
	store.dispatch(logMe(payload))
	ReactDOM.render(<App store={store}/>, document.getElementById('root'));
})
.catch(() => {
	ReactDOM.render(<App store={store}/>, document.getElementById('root'));
})
registerServiceWorker();
