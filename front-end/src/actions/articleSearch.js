import axios from 'axios';
import { SET_ARTICLE, SET_TAGS } from './types';
import _ from 'lodash'

export const search = ({...params}) => dispatch => {
    return axios.get('http://localhost:8000/article', { params: params })
    .then(res => {
    	let data = res.data.data.map(v => v._source)
    	dispatch({ type: SET_ARTICLE, data: data })
    })
}

export const newArticle = ({...params}) => dispatch => {
    return axios.post('http://localhost:8000/newArticle', { ...params })
}

export const tags = () => dispatch => {
    return axios.get('http://localhost:8000/tags').then(res => {
        dispatch({ type: SET_TAGS, data: res.data.data })
    })
}