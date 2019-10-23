import { SET_FETCH } from '../actions/types';

const initialState = {
    isLoading: false,
}
export default function(state = initialState, action ) {
    switch(action.type) {
        case SET_FETCH:
            return {
                isLoading: action.payload
            }
        default: 
            return state;
    }
}