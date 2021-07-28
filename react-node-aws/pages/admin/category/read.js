
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

  const confirmDelete = (slug) => {
    console.log('delete slug');
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
                <Link href={`/category/${category.slug}`}>
                  <Button className="btn btn-sm btn-block mb-2" variant='outline-secondary'>
                    Update
                  </Button>
                </Link>
              </Row>
              <Row>
                <Button onClick={() => confirmDelete(category.slug)} className="btn btn-sm btn-block mb-2" variant='danger'>
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