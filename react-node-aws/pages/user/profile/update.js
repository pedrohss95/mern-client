import { Button, Row, FormLabel, InputGroup, FormCheck } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import Link from 'next/link';
import Router from 'next/router';
import Layout from '../../../components/Layout';
import axios from 'axios'
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts'
import { isAuth, updateUser } from '../../../helpers/auth'
import { withUser } from '../../withUser';


const Profile = ({ user, token }) => {
  const [state, setState] = useState({
    name: user.name,
    email: user.email,
    password: '',
    error: '',
    success: '',
    buttonText: 'Update',
    allCategories: [],
    categories: user.categories
  })

  const { name, email, password, error, success, buttonText, allCategories, categories } = state;

  useEffect(() => {
    loadCategories()
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${process.env.API}/categories`)
    setState({ ...state, allCategories: response.data });
  };

  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.value, error: '', success: '', buttonText: 'Update' })
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
    setState({ ...state, buttonText: 'Updating' });
    try {
      const response = await axios.put(`${process.env.API}/user`, {
        name,
        password,
        categories
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      //console.log(response);
      updateUser(response.data, () => {
        setState({
          ...state,
          success: "Profile updated",
          buttonText: 'Updated'
        });
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        error: error.response.data.error,
        buttonText: 'Please try again'
      });
    }
  }

  const showCategories = () => {
    return allCategories && allCategories.map((category, index) => (
      <InputGroup className='list-unstyled' key={category._id}>
        <FormCheck type="checkbox" label={category.name} onChange={handleToggle(category._id)}
          checked={categories.includes(category._id)} className='ms-2' />
      </InputGroup>

    ))
  };

  const updateProfileForm = () => (
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
        <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Input your email" disabled />
      </div>
      <div className="form-group">
        <h3>
          Password
        </h3>
        <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Update your password with 8 characters" />
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
          <h1>Update Profile</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {updateProfileForm()}
        </div>
      </Row>
    </Layout>
  )
}

export default withUser(Profile);