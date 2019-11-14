import React from 'react'
import {Redirect} from 'react-router'
import * as jwt from 'jwt-decode'

export const Authenticate = Component => props => {
	let token = props.cookies.get('token')
	if(token){
		try{
			let user = jwt(token)
			if(user.type === 'user')
				return <Component {...props} />
		}
		catch (e) {
			return <Redirect to="/login" />
		}
	}
	return <Redirect to="/login" />
}

export default Authenticate