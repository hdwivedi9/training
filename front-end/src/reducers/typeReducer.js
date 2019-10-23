import { SET_TYPE } from '../actions/types';

const initialState = {
    type: ''
}
export default function(state = initialState, action ) {
    switch(action.type) {
        case SET_TYPE:
            return {
                type: action.payload
            }
        default: 
            return state;
    }
}