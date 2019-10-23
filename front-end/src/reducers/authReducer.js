import { SET_CURRENT_USER } from '../actions/types';
import {isEmpty} from 'lodash';

const initialState = {
    isAuthenticated: false,
    isAdmin: false,
    user: {}
}
export default function(state = initialState, action ) {
    switch(action.type) {
        case SET_CURRENT_USER:
            return {
                isAuthenticated: !isEmpty(action.user),
                isAdmin: !isEmpty(action.user) ? action.user.role==='admin' : false,
                user: action.user
            }
        default: 
            return state;
    }
}