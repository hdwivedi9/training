import { combineReducers } from 'redux';
import authReducer from './authReducer';
import typeReducer from './typeReducer';
import articleReducer from './articleReducer';
import { reducer as formReducer } from 'redux-form'
//import loadReducer from './loadReducer';

export default combineReducers({

	auth: authReducer,
	type: typeReducer,
	//laod: loadReducer,
	form: formReducer,
	article: articleReducer,
});