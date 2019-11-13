import { SET_ARTICLE, SET_TAGS } from '../actions/types';

const initialState = {
    result: {},
    tag_count: [],
}
export default function(state = initialState, action ) {
    switch(action.type) {
        case SET_ARTICLE:
          return {
          	...state,
            result: action.data
          }
        case SET_TAGS:
      		return {
      			...state,
						tag_count: action.data
      		}
        default: 
            return state;
    }
}