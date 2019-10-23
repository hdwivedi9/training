import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import rootReducer from './reducers/rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { CookiesProvider, withCookies } from 'react-cookie';
import { Provider } from 'react-redux';



const inititalState = {};

const store = createStore(
    rootReducer, 
    inititalState, 

    composeWithDevTools(applyMiddleware(thunk))
);


ReactDOM.render(

	<CookiesProvider>
    	<Provider store = { store }>
			<App />
		</Provider>
	</CookiesProvider>

	, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
