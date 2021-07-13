import dynamic from 'next/dynamic';
import { useState, useEffect} from 'react';
import Resizer from 'react-image-file-resizer';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false});
import axios from 'axios';
import { showSuccessMessage, showErrorMessage} from '../../../helpers/alerts';
import Layout from '../../../components/Layout';
import { withAdmin } from '../../withAdmin';
import {
    Button, Form, FormGroup,FormControl, FormLabel, Row
} from 'react-bootstrap'
import 'react-quill/dist/quill.bubble.css';

const Create = ({ user, token }) => {
    const [state, setState] = useState({
        name: '',
        error: '',
        success: '',
        image: '',
        buttonText: 'Create'
    });

    const [content, setContent ] = useState('');

    const [imageUploadButtonName, setImageUploadButtonName ] = useState('Upload Image');

    const { name, success, error, image, buttonText } = state;

    const handleChange = (name) => (event) => {
        setState({... state, [name]: event.target.value, error: '', success: ''});
    };

    const handleContent = (event) => {
      setContent(event);
      setState({... state, error: '', success: ''});
    };
    const handleImage = (event) => {
      let fileInput = false;
      if (event.target.files[0]) {
        fileInput = true;
      }
      setImageUploadButtonName(event.target.files[0].name);
      if (fileInput) {
        try {
          Resizer.imageFileResizer(
            event.target.files[0],
            300,
            300,
            "JPEG",
            100,
            0,
            (uri) => {
            setState({... state, image: uri, error: '', success: '' });
            },
            "base64",
            200,
            200
          );
        } catch (err) {
          console.log(err);
          setState({...state,
            error: error.response.data.error,
            imageUploadButtonName
          })
        }
      }
    }
    

    const handleSubmit = async event => {
      event.preventDefault();
      setState({...state, buttonText: 'Creating'});
      try {
        const response = await axios.post(`${process.env.API}/category`, 
        {name, content, image}, 
        {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: 'application/json'
          },
        });
        console.log('category created',response);
        setImageUploadButtonName('Upload Image');
        setState({
          ...state,  
          name: '',
          content: '',
          image: '',
          buttonText: 'Created',
          imageUploadButtonName,
          success: `${response.data.name} is created`
        })
      } catch (error) {
        console.log('category creation failed', error);
        setState({...state,
          error: error.response.data.error,
          buttonText: 'Create'
        });
      }
    };

    const createCategoryForm = () => (
        <Form onSubmit={handleSubmit}>
            <div>   
            <FormGroup>
            <FormLabel className="text-muted">Name</FormLabel>
            <FormControl onChange={handleChange('name')} type="text" value={name} placeholder="Type your Category Name" required/>
            </FormGroup>
            </div>
            <div>
            <FormGroup controlId="exampleForm.ControlTextarea1">
            <FormLabel className="text-muted">Content</FormLabel>
            <ReactQuill
            onChange={handleContent} 
            value={content}
            placeholder= "Type your description..."
            className="pb-5 mb-3"
            theme="bubble"
            style={{ border:'1px solid #666'}} 
            />
            </FormGroup>
            </div>
            <div>
            <FormGroup>
            <br />
            <FormLabel className="btn btn-secondary">
                {imageUploadButtonName}
                <FormControl onChange={handleImage} 
                type="file" 
                accept="image/*" 
                placeholder="Type your Category Name" 
                required hidden
            />
            </FormLabel>
            </FormGroup>
            <br />
            </div>
            <div>
             <Button variant="outline-dark" type="submit" onClick={handleSubmit}>
                    {buttonText}
            </Button>
            </div>
        </Form>
    );

    return (
        <Layout>
            <Row>
                <div className="col-me-auto offset-ms-3">
                    <h1>
                        Create Category
                    </h1>
                    <br />
                    {createCategoryForm()}
                    <br />
                    {success && showSuccessMessage(success)} 
                    {error && showErrorMessage(error)}
                </div>
            </Row>
        </Layout>
    );
};

export default withAdmin(Create);