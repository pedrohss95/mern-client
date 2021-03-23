import {useState} from 'react'
import { Form, FormText, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';
import Layout from '../components/Layout'

const Login = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
    error: '',
    success: ''
  })

  const {email, password, error, success} = state;

  const handleChange = (name) => (event) => {
    setState({... state, [name]: event.target.value, error: '', success: ''})
  };

  const handleSubmit = event => {
    event.preventDefault();
    console.table({name, email, password});
  };


  const loginForm = () =>(
    <Form onSubmit={handleSubmit}>
      <FormGroup controlId="formBasicEmail">
        <h5>
          <FormLabel id="inputGroup-sizing-default">Email address</FormLabel>
        </h5>
        <FormControl onChange={handleChange('email')} type="email" placeholder="Enter email" />
        <FormText className="text-muted">
          Type your email to Login.
        </FormText>
      </FormGroup>
      <FormGroup controlId="formBasicPassword">
        <h5>
          <FormLabel id="inputGroup-sizing-default">Password</FormLabel>
        </h5>
        <FormControl onChange={handleChange('password')} className="mb-3" type="password" placeholder="Password" />
      </FormGroup>
      <Button variant="outline-dark" type="submit">
        Submit
      </Button> 
    </Form>
  );

  return (
      <Layout>
        {loginForm()}
      </Layout> 
    )
}

export default Login;