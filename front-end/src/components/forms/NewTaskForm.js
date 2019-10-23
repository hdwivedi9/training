import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { TextField, FormControl, InputLabel, Select, OutlinedInput, FormHelperText, Button} from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns';
import { connect } from "react-redux";
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import moment from 'moment';


const validate = values => {
  const errors = {}
  if (!values.title) {
    errors.title = 'Required'
  } else if (values.title.length > 200) {
    errors.title = 'Limit Exceeded'
  }
  if (!values.description) {
    errors.description = 'Required'
  } else if (values.description.length > 10000) {
    errors.description = 'Limit Exceeded'
  }
  if (!values.due_date) {
    errors.due_date = 'Required'
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
const textAreaField = ({ input, label, type, meta: { touched, error } }) => (
  <TextField variant="outlined" multiline rows='4' margin='normal' error={touched && error} label={label} placeholder={label} type={type} helperText={touched && error} {...input} inputProps={{style:{width:'200px'}}}/>
);
const dateTimeField = ({ input, label, meta: { touched, error } }) => (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DateTimePicker
        inputVariant="outlined"
        label={label}
        showTodayButton disablePast autoOk
        format="dd MMMM yyyy h:mm a"
        error={touched && error} helperText={touched && error}
        maxDateMessage='' minDateMessage=''
        {...input}
        InputProps={{style: {width:'230px'}}}
      />
    </MuiPickersUtilsProvider>
);
const formatDate = (value,name) => {
  return value?value:null;
}
const parseDate = (value,name) => {
  if(!value)return null;
  return moment(value).toDate();
}

export let NewTaskForm = props => {
  const { error, handleSubmit, pristine, reset, submitting, invalid } = props;
  return (
    <form style={{padding:'30px 0 20px 570px'}} onSubmit={handleSubmit}>
      <div style={{padding:'20px', maxWidth:'200px'}}>
        <Field name="title" component={renderField} type="text" label="Title"/>
      </div>
      <div style={{padding:'20px', maxWidth:'200px'}}>
        <Field name="description" component={textAreaField} type="email" label="Description"/>
      </div>
      <div style={{padding:'20px', maxWidth:'200px'}}>
        <Field name="due_date" component={dateTimeField} label="Due Date" parse={parseDate} format={formatDate}/>
      </div>
      <Button variant="contained" color="primary" type="submit" disabled={invalid||submitting} style={{padding:'10px 88px', margin:'20px'}}>Submit</Button>
      <Button variant="outlined" type="button" disabled={pristine || submitting} onClick={reset} style={{padding:'10px 50px', margin:'20px'}}>Clear</Button>
    </form>
  )
}

export default reduxForm({
  form: 'new_task', validate, enableReinitialize: true
})(NewTaskForm)
