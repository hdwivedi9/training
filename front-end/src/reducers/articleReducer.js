import { SET_ARTICLE } from '../actions/types';

const initialState = {
    result: {},
}
export default function(state = initialState, action ) {
    switch(action.type) {
        case SET_ARTICLE:
            return {
                result: action.data
            }
        default: 
            return state;
    }
}