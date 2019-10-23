import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { TextField, Button} from '@material-ui/core'


const validate = values => {
  const errors = {}
  // if (!values.name) {
  //   errors.username = 'Required'
  // } else if (values.name.length > 200) {
  //   errors.username = 'Limit Exceeded'
  // }
  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\..+$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  
  if (!values.password) {
    errors.password = 'Required'
  }// else if (isNaN(Number(values.age))) {
    //errors.age = 'Invalid Password'
  

  return errors
}

// const warn = values => {
//   const warnings = {}
//   if (values.age < 19) {
//     warnings.age = 'Hmm, you seem a bit young...'
//   }
//   return warnings
// }

const renderField = ({ input, label, type, meta: { touched, invalid, error } }) => (

  <TextField variant="outlined" autoFocus error={touched && invalid} label={label} placeholder={label} type={type} helperText={touched && error} {...input} inputProps={{style:{width:'200px'}}}/>
)



export let LoginForm = props => {
  const { error, handleSubmit, pristine, reset, submitting, invalid } = props; //console.log(pristine, error);
  return (
    <form style={{padding:'30px 0 20px 570px'}} onSubmit={handleSubmit}>
      <div style={{padding:'20px', maxWidth:'200px'}}>
        <Field name="email" component={renderField} type="email" label="Email"/>
      </div>
      <div style={{padding:'20px', maxWidth:'200px'}}>
        <Field name="password" component={renderField} type="password" label="Password" />
      </div>
      {error && <span style={{color:'red', paddingLeft:'20px', display:'block'}}>{error}</span>}
      <Button variant="contained" color="primary" type="submit" disabled={invalid||submitting} style={{padding:'10px 88px', margin:'20px'}}>Submit</Button>
      <Button variant="outlined" type="button" disabled={pristine || submitting} onClick={reset} style={{padding:'10px 50px', margin:'20px'}}>Clear</Button>
    </form>
  )
}

export default LoginForm = reduxForm({
  form: 'login', validate
})(LoginForm)
