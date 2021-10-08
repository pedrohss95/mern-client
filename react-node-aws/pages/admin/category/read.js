
import { useState, useEffect } from 'react';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import Layout from '../../../components/Layout';
import { withAdmin } from '../../withAdmin';
import {
  Button, Form, FormGroup, FormControl, FormLabel, Row, Col
} from 'react-bootstrap'
import Link from 'next/link';


const Read = ({ user, token }) => {
  const [state, setState] = useState({
    categories: [],
    error: '',
    success: '',
  });

  const { categories, error, success } = state;

  useEffect(() => {
    loadCategories()
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${process.env.API}/categories`);
    setState({ ...state, categories: response.data });
  }

  const confirmDelete = (event, slug) => {
    event.preventDefault();
    //console.log('delete slug');
    let answer = window.confirm('Are you sure want to delete?')
    if (answer) { 
      handleDelete(slug);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const response = await axios.delete(`${process.env.API}/category/${slug}`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      console.log('category deleted ok',response);
      loadCategories();
    } catch (error) {
      console.log('category delete error', error);
    }
  }

  const listCategories = () => categories.map((category, index) => (
    <Link href={`/links/${category.slug}`} key={index}>
      <a style={{ border: '1px solid black' }} className="bg-light p-3 col-md-6">
        <div>
          <Row>
            <div className="col-md-3">
              <img src={category.image.url}
                alt={category.name}
                style={{ width: '100px', height: 'auto' }}
                className="pe-3"
              />
            </div>
            <div className="col-md-6">
              <h3>{category.name}</h3>
            </div>
            <div className="col-md-3">
              <Row>
                <Link href={`/admin/category/${category.slug}`}>
                  <Button className="btn btn-sm btn-block mb-2" variant='outline-secondary'>
                    Update
                  </Button>
                </Link>
              </Row>
              <Row>
                <Button onClick={(event) => confirmDelete(event,category.slug)} className="btn btn-sm btn-block mb-2" variant='danger'>
                  Delete
                </Button>
              </Row>
            </div>
          </Row>
        </div>
      </a>
    </Link>
  ));

  return (
    <Layout>
      <Row>
        <Col>
          <h1> List of Categories</h1>
          <br />
        </Col>
      </Row>
      <Row>
        {listCategories()}
      </Row>
    </Layout>
  )
}

export default withAdmin(Read);