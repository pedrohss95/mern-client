import { Button } from 'react-bootstrap'
import {useState} from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import {showSuccessMessage,showErrorMessage} from '../helpers/alerts'


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

  const handleSubmit = async event => {
    event.preventDefault();
    setState({...state, buttonText: 'Registering'});
    try {
      const response = await axios.post(`${process.env.API}/register`, {
        name,
        password,
        email
      })
      console.log(response);
      setState({
        ...state,  
        name: '',
        email: '',
        password: '',
        success: response.data.message,
        buttonText: 'Submitted'
      })
    } catch (error) {
      console.log(error);
      setState({...state,
        error: error.response.data.error,
        buttonText: 'Please try again'
      });
    }
  }

  // const handleSubmit = event => {
  //   event.preventDefault();
  //   setState({...state, buttonText: 'Registering'});
  //   // console.table({name, email, password});
  //   axios.post(`http://localhost:8000/api/register`, {
  //       name,
  //       password,
  //       email
  //   }).then(response => {
  //         console.log(response);
  //         setState({
  //           ...state,  
  //           name: '',
  //           email: '',
  //           password: '',
  //           success: response.data.message,
  //           buttonText: 'Submitted'
  //         })
  //   })
  //   .catch(error => {
  //       console.log(error);
  //       setState({...state,
  //         error: error.response.data.message,
  //         buttonText: 'Please try again'
  //     })
  //   });
  // };


  const registerForm = () => (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h3>
            Name
          </h3>
           <input value={name} onChange={handleChange('name')} type="text" className="form-control" placeholder="Input your name" required/>
        </div>
        <div className="form-group">
          <h3>
            Email
          </h3>
          <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Input your email" required/>
        </div>
        <div className="form-group">
          <h3>
            Password
          </h3>
          <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Input your password with 8 characters" required/>
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
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {registerForm()}
        </div>
      </Layout>
  )
}

export default Register;