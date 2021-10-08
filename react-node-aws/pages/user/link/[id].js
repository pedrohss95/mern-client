import { useState, useEffect } from 'react';
import React from 'react';
import Layout from "../../../components/Layout";
import { withUser } from '../../withUser';
import { getCookie, isAuth } from '../../../helpers/auth';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import {
  Button, Form, FormGroup, FormControl, FormLabel, Row, InputGroup, FormCheck
} from 'react-bootstrap';

const Update = ({ oldLink, token }) => {
  //state
  const [state, setState] = useState({
    title: oldLink.title,
    url: oldLink.url,
    categories: oldLink.categories,
    allCategories: [],
    success: '',
    error: '',
    type: oldLink.type,
    medium: oldLink.medium
  });

  const { title, url, categories, allCategories, type, medium, success, error} = state;

  //load categories when component mounts using useEffect

  useEffect(() => {
    loadCategories()
  }, [success]);

  const loadCategories = async () => {
    const response = await axios.get(`${process.env.API}/categories`)
    setState({ ...state, allCategories: response.data });
  };

  const handleTitleChange = event => {
    setState({ ...state, title: event.target.value, error: '', success: '' });
  }

  const handleURLChange = event => {
    setState({ ...state, url: event.target.value, error: '', success: '' });
  }

  const handleSubmit = async event => {
    event.preventDefault();
    //console.table({title, url, categories, type, medium});
    const endPoint = isAuth() && isAuth().role != "admin" ? `${process.env.API}/link/${oldLink._id}` : `${process.env.API}/link/admin/${oldLink._id}`;
    try {
      const response = await axios.put(endPoint, {
        title,
        url,
        categories,
        type,
        medium
      }, {
        headers:
        {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('link created', response);
      setState({
        ...state, success:"Link is updated"
      });
    } catch (error) {
      console.log('link update failed', error);
      setState({
        ...state,
        error: error.response.data.error,  
      });
    }

  }

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

  const handleTypeClick = event => {
    setState({ ...state, type: event.target.value, success: '', error: '' });
  };

  const handleMediumClick = event => {
    setState({ ...state, medium: event.target.value, success: '', error: '' });
  };
  // show types
  const showTypes = () => (
    <React.Fragment>
      <FormGroup className="mb-3" controlId="formBasicCheckbox">
        <FormCheck type="radio" label="Free"
          onClick={handleTypeClick} onChange={()=>{}}
          checked={type === 'free'} value='free' className='ms-2' name='type' />
        <FormCheck type="radio" label="Paid"
          onClick={handleTypeClick} onChange={()=>{}}
          checked={type === 'paid'} value='paid' className='ms-2' name='type' />
      </FormGroup>
    </React.Fragment>
  );
  // show types
  const showMedium = () => (
    <React.Fragment>
      <FormGroup className="mb-3" controlId="formBasicCheckbox">
        <FormCheck type="radio" label="Video"
          onClick={handleMediumClick}
          checked={medium === 'video'} value='video' className='ms-2' name='medium' />
        <FormCheck type="radio" label="Book"
          onClick={handleMediumClick}
          checked={medium === 'book'} value='book' className='ms-2' name='medium' />
      </FormGroup>
    </React.Fragment>
  );
  //show all categories checkbox
  const showCategories = () => {
    return allCategories && allCategories.map((category, index) => (
      <InputGroup className='list-unstyled' key={category._id}>
        <FormCheck type="checkbox" checked={categories.includes(category._id)}label={category.name} onChange={handleToggle(category._id)} className='ms-2' />
      </InputGroup>

    ))
  };
  // create link form
  const submitLinkForm = () => (
    <Form onSubmit={handleSubmit}>
      <div>
        <FormGroup>
          <FormLabel className="text-muted">Title</FormLabel>
          <FormControl onChange={handleTitleChange} type="text" value={title} placeholder="Insert the Link Title" required/>
        </FormGroup>
      </div>
      <div>
        <FormGroup>
          <FormLabel className="text-muted">URL</FormLabel>
          <FormControl onChange={handleURLChange} type="text" value={url} placeholder="Insert the Link URL" required />
        </FormGroup>
      </div>
      <div>
        <br />
        <Button variant="outline-dark" type="submit" onClick={handleSubmit} disabled={!token}>
          {isAuth() || token ? 'Submit' : 'Please Login'}
        </Button>
      </div>
    </Form>
  );

  return (
    <Layout>
      <Row>
        <div className="col-me-auto offset-ms-3">
          <h1>Update link/URL</h1>
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
        </div>
      </Row>
      <Row>
        <div className="col-md-4">
          <FormLabel className="text-muted ml-4">
            Category
          </FormLabel>
          <ul style={{ maxHeight: '100px', overflowY: 'scroll', padding: '0px' }}>{showCategories()}</ul>
          <FormLabel className="text-muted ml-4">
            Type
          </FormLabel>
          <ul style={{padding: '0px'}}>{showTypes()}</ul>
          <FormLabel className="text-muted ml-4">
            Medium
          </FormLabel>
          <ul style={{padding: '0px'}}>{showMedium()}</ul>
        </div>
        <div className="col-md-8">
          {submitLinkForm()}
        </div>
      </Row>
    </Layout>
  );
}

Update.getInitialProps = async ({ req, query, token }) => {
  const response = await axios.get(`${process.env.API}/link/${query.id}`)
  return { oldLink: response.data, token}
}

export default withUser(Update);