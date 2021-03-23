import { Button } from 'react-bootstrap'
import {useState} from 'react'
import Layout from '../components/Layout'

const  Register = () => {
  const [state, setState] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    error: '',
    success: '',
    buttonText: 'Register'
  })
  const registerForm = () => (
      <form onSubmit={handleSubmit()}>
        <div className="form-group">
          <h3>
            Name
          </h3>
           <input onChange={handleChange('name')} type="text" className="form-control" placeholder="Input your name" />
        </div>
        <div className="form-group">
          <h3>
            Email
          </h3>
          <input onChange={handleChange('email')} type="text" className="form-control" placeholder="Input your email" />
        </div>
        <div className="form-group">
          <h3>
            Phone
          </h3>
          <input onChange={handleChange('phone')} type="text" className="form-control" placeholder="Input your phone" />
        </div>
        <div className="form-group">
          <h3>
            Password
          </h3>
          <input onChange={handleChange('password')} type="text" className="form-control" placeholder="Input your password with 8 characters" />
        </div>
        <div>
        <Button onChange={handleChange('buttonText')} className="btn btn-dark" type="submit">
          Register
        </Button>{' '}
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