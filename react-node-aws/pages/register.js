import { Button } from 'react-bootstrap'
import {useState} from 'react'
import Layout from '../components/Layout'
import axios from 'axios'

const  Register = () => {
  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: '',
    buttonText: 'Register'
  })

  const {name, email, password, error, success, buttonText} = state;

  const handleChange = (name) => (event) => {
    setState({... state, [name]: event.target.value, error: '', success: '', buttonText: 'Register'})
  };

  const handleSubmit = event => {
    event.preventDefault();
    // console.table({name, email, password});
    axios.post(`http://localhost:8000/api/register`, {
        name,
        password,
        email
    }).then(response => console.log(response))
    .catch(error => console.log(error));
  };


  const registerForm = () => (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h3>
            Name
          </h3>
           <input value={name} onChange={handleChange('name')} type="text" className="form-control" placeholder="Input your name" />
        </div>
        <div className="form-group">
          <h3>
            Email
          </h3>
          <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Input your email" />
        </div>
        <div className="form-group">
          <h3>
            Password
          </h3>
          <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Input your password with 8 characters" />
        </div>
        <br />
        <div>
        <Button value={buttonText} onChange={handleChange('buttonText')} variant="outline-dark" type="submit">
          {buttonText}
        </Button>
        </div>  
      </form>
  );
  return (
      <Layout>
        <div className="col-md-6 offset-md-3">
          <h1>Register</h1> 
          <br />
          {registerForm()}
        </div>
      </Layout>
  )
}

export default Register;