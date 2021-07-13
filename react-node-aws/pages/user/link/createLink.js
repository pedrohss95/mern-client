import { useState, useEffect} from 'react';
import Layout from "../../../components/Layout";
import {withUser} from '../../withUser';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage} from '../../../helpers/alerts';
import {
  Button, Form, FormGroup,FormControl, FormLabel, Row, InputGroup
} from 'react-bootstrap';

const Create = () => {
  //state
  const [state, setState] = useState({
    title: '',
    url: '',
    categories: [],
    allCategories: [],
    success: '',
    error: '',
    type: '',
    medium: '',
    buttonText: 'Submit'
  });

  const {title, url, categories, allCategories, type, medium, success, error, buttonText} = state;

  //load categories when component mounts using useEffect

  useEffect(()=>{
    loadCategories()
  }, [success]);

  const loadCategories = async () => {
    const response = await axios.get(`${process.env.API}/categories`)
    setState({...state, allCategories: response.data});
  }; 

  const handleTitleChange = event => {
    setState({...state, title: event.target.value, error: '', success: ''});
  }

  const handleURLChange = event => {
    setState({...state, url: event.target.value, error: '', success: ''});
  }

  const handleSubmit = async event => {
    console.log('Post to server')
  }

  const handleToggle = category => () => {

  }

  //show all categories checkbox
  const showCategories = () => {
    return allCategories && allCategories.map((category, index) => (
      <InputGroup className='list-unstyled' key={category._id}> 
         <Form.Check type="checkbox" label={category.name} onChange={handleToggle(category._id)} className='ms-2' />
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
        <FormControl onChange={handleURLChange} type="text" value={url} placeholder="Insert the Link URL" required/>
        </FormGroup>
      </div>
      <div>
        <br/>
        <Button variant="outline-dark" type="submit" onClick={handleSubmit}>
        {buttonText}
        </Button>
      </div>
    </Form>
  );

  return(
  <Layout>
    <Row>
    <div className="col-me-auto offset-ms-3">
    <h1>Submit new link/URL</h1>
    {success && showSuccessMessage(success)}
    {error && showErrorMessage(error)}
    </div>
    </Row>
    <Row>
    <div className="col-md-4">
    <FormLabel className="text-muted ml-4">
      Category
    </FormLabel>
    <ul style={{maxHeight: '100px',overflowY:'scroll'}}>{showCategories()}</ul>
    </div>
    <div className="col-md-8">
    {submitLinkForm()}
    </div>
    </Row>
  </Layout>
  );
}

export default withUser(Create);