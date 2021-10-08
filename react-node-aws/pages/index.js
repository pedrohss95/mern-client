import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/Layout'
import { Form, FormText, FormGroup, FormLabel, FormControl, Button, Row } from 'react-bootstrap';
import moment from 'moment';


const Home = ({ categories }) => {

  const head = () => (
    <Head> <title>MERN STACK APP || WELCOME</title> </Head>
  )

  const [popular, setPopular] = useState([]);

  useEffect(()=>{
    loadPopular();
  },[]);

  const loadPopular = async () => {
    const response = await axios.get(`${process.env.API}/link/popular`);
    setPopular(response.data);
  };

  const handleClick = async (linkId) => {
    const response = await axios.put(`${process.env.API}/click-counter`,{linkId});
    loadPopular();
  }

  const listOfLinks = () => (
    popular.map((link, index)=> (
      <div className="row alert alert-secondary p-2">
        <div className="col-md-8" onClick={()=> handleClick(link._id)}>
          <a href={link.url} target="_blank">
            <h5 className="pt-2">
            {link.title}
            </h5>
            <h6 className="pt-2 text-danger" style={{fontSize:'12px'}}>
            {link.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4">
          <span className="pull-right">
            {moment(link.createdAt).fromNow()} by {link.postedBy.name}
          </span>
        </div>

        <div className="col-md-12">
          <span className="badge text-dark">{link.type} {link.medium}</span>
          {link.categories.map((category, index)=>(
            <span key={index} className="badge text-success">
              {category.name}
            </span>
          ))}
          <span className="badge text-secondary pull-right">{link.clicks} clicks</span>
        </div>
      </div>
    ))
  )

  const listCategories = () => categories.map((category, index) => (
    <Link href={`/links/${category.slug}`}>
      <a style={{ border: '1px solid black' }} className="bg-light p-3 col-md-4">
        <div>
          <Row>
            <div className="col-md-4">
              <img src={category.image.url}
                alt={category.name}
                style={{ width: '100px', height: 'auto' }}
                className="pe-3"
              />
            </div>
            <div className="col-md-8">
              <h3>{category.name}</h3>
            </div>
          </Row>
        </div>
      </a>
    </Link>
  ))
  return (
    <div id='parent'>
      {head()}
      {/* <link rel='stylesheet' href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossOrigin="anonymous"/> */}
      <Layout>
        <Row as="div">
          <div className="col-md-12">
            <h1 className="font-weight-bold">Browse Tutorials/Courses</h1>
            <br />
          </div>
        </Row>
        <Row>
          {listCategories()}
        </Row>
        <Row className="pt-5">
          <h2 className="font-weight-bold pb-3">Trending 3 Most Popular</h2>
          <div className="col-md-12 overflow-hidden">
            {listOfLinks()}
          </div>
        </Row>
      </Layout>
    </div>

  );
};
Home.getInitialProps = async () => {
  const response = await axios.get(`${process.env.API}/categories`);
  return {
    categories: response.data
  };
}
export default Home;
