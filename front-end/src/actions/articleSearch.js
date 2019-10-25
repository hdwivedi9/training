import axios from 'axios';
import { SET_ARTICLE } from './types';
import _ from 'lodash'

export const search = ({...params}) => dispatch => {
    return axios.get('http://localhost:8000/article', { params: params })
    .then(res => {
    	let data = res.data.data
    	if(!_.isArray(data)){
    		data = Object.values(data)
    	}
    	dispatch({
    		type: SET_ARTICLE,
    		data: data,
    	})
    })
}