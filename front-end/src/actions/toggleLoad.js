export const toggleLoad = (val) => dispatch => {
    
    dispatch({
        type: SET_FETCH,
        payload: val
    });
    
}