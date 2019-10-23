import {SET_TYPE} from './types'

export const changeType = (type) => dispatch => {
    
    dispatch({
        type: SET_TYPE,
        payload: type
    });
    
}