import { Button, Row, FormLabel, InputGroup, FormCheck } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import Link from 'next/link';
import Router from 'next/router';
import Layout from '../components/Layout'
import axios from 'axios'
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts'
import { isAuth } from '../helpers/auth'


const Register = () => {
  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: '',
    buttonText: 'Register',
    allCategories: [],
    categories: []
  })

  const { name, email, password, error, success, buttonText, allCategories, categories } = state;

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

  useEffect(() => {
    loadCategories()
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${process.env.API}/categories`)
    setState({ ...state, allCategories: response.data });
  };

  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.value, error: '', success: '', buttonText: 'Register' })
  };

  const handleToggle = category => () => {
    // return the first index or -1
    const clickedCategory = categories.indexOf(category);
    const allItems = [...categories];

    if (clickedCategory === -1) {
      allItems.push(category);
    } else {
      allItems.splice(clickedCategory, 1);
    }
    setState({ ...state, categories: allItems, success: '', error: '' });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setState({ ...state, buttonText: 'Registering' });
    try {
      const response = await axios.post(`${process.env.API}/register`, {
        name,
        password,
        email, 
        categories
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
      setState({
        ...state,
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

  const showCategories = () => {
    return allCategories && allCategories.map((category, index) => (
      <InputGroup className='list-unstyled' key={category._id}>
        <FormCheck type="checkbox" label={category.name} onChange={handleToggle(category._id)} className='ms-2' />
      </InputGroup>

    ))
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <h3>
          Name
        </h3>
        <input value={name} onChange={handleChange('name')} type="text" className="form-control" placeholder="Input your name" required />
      </div>
      <div className="form-group">
        <h3>
          Email
        </h3>
        <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Input your email" required />
      </div>
      <div className="form-group">
        <h3>
          Password
        </h3>
        <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Input your password with 8 characters" required />
      </div>
      <FormLabel className="text-muted ml-4">
        Category
      </FormLabel>
      <ul style={{ maxHeight: '100px', overflowY: 'scroll', padding: '0px' }}>{showCategories()}</ul>
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
      <Row >
        <div className="col-md-4 offset-ms-3">
          <h1>Register</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {registerForm()}
        </div>
      </Row>
    </Layout>
  )
}

export default Register;