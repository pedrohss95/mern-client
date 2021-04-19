import {useEffect, useState} from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Form, FormText, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';
import Layout from '../components/Layout';
import axios from 'axios';
import {showSuccessMessage,showErrorMessage} from '../helpers/alerts';
import { authenticate, isAuth } from '../helpers/auth'


const Login = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
    error: '',
    success: '',
    buttonText: 'Login'
  })

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

  const {email, password, error, success, buttonText} = state;

  const handleChange = (name) => (event) => {
    setState({... state, [name]: event.target.value, error: '', success: ''})
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setState({...state, buttonText: 'Logging in'});
    try {
      const response = await axios.post(`${process.env.API}/login`, {
        email,
        password
      })
      //console.log(response);
      authenticate(response, () => 
      isAuth() && isAuth().role === 'admin' ? Router.push('/admin') : Router.push('/user')
      );

      setState({
        ...state,  
        email: '',
        password: '',
        success: response.data.message,
        buttonText: 'Login'
      })
    } catch (error) {
      console.log(error);
      setState({...state,
        error: error.response.data.error,
        buttonText: 'Login'
      });
    }
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
        {buttonText}
      </Button> 
    </Form>
  );

  return (
      <Layout>
        <div className="col-md-6 offset-md-3">
        <h1>Login</h1>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {loginForm()}
        <footer>
          <a href=''>Forgot Password?</a>
        </footer>
        </div>
      </Layout> 
    )
}

export default Login;