import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { TextField, FormControl, InputLabel, Select, OutlinedInput, FormHelperText, Button} from '@material-ui/core'


const validate = values => {
  const errors = {}
  if (!values.name) {
    errors.name = 'Required'
  } else if (values.name.length > 200) {
    errors.name = 'Limit Exceeded'
  }
  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\..+$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length < 8) {
    errors.password = 'Minimum 8 characters required' 
  } else if (!/^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[0-9])(?=\S*[\W])\S*$/.test(values.password)) {
    errors.password = 'Atleast one lowercase, uppercase, digit & special character required'
  }
  if (!values.role) {
    errors.role = 'Required'
  }

  return errors
}

// const warn = values => {
//   const warnings = {}
//   if (values.age < 19) {
//     warnings.age = 'Hmm, you seem a bit young...'
//   }
//   return warnings
// }

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <TextField variant="outlined" error={touched && error} label={label} placeholder={label} type={type} helperText={touched && error} {...input} inputProps={{style:{width:'200px'}}}/>
);
const selectField = ({ input, label, meta: { touched, error }, children }) => (
  <FormControl variant="outlined" error={touched && error}>
    <InputLabel>{label}</InputLabel>
    <Select native input={<OutlinedInput name="Role" labelWidth={30} {...input}/>} inputProps={{style:{width:'200px'}}}>{children}</Select>
    <FormHelperText>{touched && error}</FormHelperText>
  </FormControl>
);


export let NewUserForm = props => {
  const { error, handleSubmit, pristine, reset, submitting, invalid } = props; //console.log(pristine, error);
  return (
    <form style={{padding:'30px 0 20px 570px'}} onSubmit={handleSubmit}>
      <div style={{padding:'20px', maxWidth:'200px'}}>
        <Field name="name" component={renderField} type="text" label="Name"/>
      </div>
      <div style={{padding:'20px', maxWidth:'200px'}}>
        <Field name="email" component={renderField} type="email" label="Email"/>
      </div>
      <div style={{padding:'20px', maxWidth:'200px'}}>
        <Field name="password" component={renderField} type="password" label="Password" />
      </div>
      <div style={{padding:'20px', maxWidth:'200px'}}>
        <Field name="role" component={selectField} label="Role">
          <option value="" disabled hidden />
          <option value={'admin'}>Admin</option>
          <option value={'normal'}>Normal</option>
        </Field>
      </div>
      <Button variant="contained" color="primary" type="submit" disabled={invalid||submitting} style={{padding:'10px 88px', margin:'20px'}}>Submit</Button>
      <Button variant="outlined" type="button" disabled={pristine || submitting} onClick={reset} style={{padding:'10px 50px', margin:'20px'}}>Clear</Button>
    </form>
  )
}

export default NewUserForm = reduxForm({
  form: 'new_user', validate
})(NewUserForm)
