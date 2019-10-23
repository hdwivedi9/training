import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import {SET_CURRENT_USER} from './types';

export const setCurrentUser = user => {
    return {
        type: SET_CURRENT_USER,
        user: user
    }
}

export const login = (user, cookies) => dispatch => {
    return axios.post('http://localhost:8000/login', user)
    .then(res => {
        const token = cookies.get('token');
        dispatch(setCurrentUser(jwt_decode(token))); 
    })
}

export const logout = (cookies, history) => dispatch => {
	cookies.remove('token', {path: '/'});
	setAuthToken(false);
	dispatch(setCurrentUser({}));
	history.push('/login');
}

export const getAuth = (cookies) => dispatch => {
	const token = cookies.get('token');
	if(token) dispatch(setCurrentUser(jwt_decode(token)));
}
