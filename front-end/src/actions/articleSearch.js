import axios from 'axios';
import { SET_ARTICLE } from './types';

export const search = ({...params}) => dispatch => {
    return axios.get('http://localhost:8000/article', { params: params })
    .then(res => {
    	dispatch({
    		type: SET_ARTICLE,
    		data: res.data,
    	})
    })
}