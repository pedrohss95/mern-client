import axios from 'axios';
import Link from 'next/link';
import Layout from '../components/Layout'
import { Form, FormText, FormGroup, FormLabel, FormControl, Button, Row } from 'react-bootstrap';


 const Home = ({categories}) => {
  const listCategories = () => categories.map((category, index)=>(
    <Link href="/">
      <a style={{border: '1px solid black'}} className="bg-light p-3 col-md-4">
        <div>
          <Row>
            <div className="col-md-4">
              <img src={category.image.url} 
              alt={category.name} 
              style={{width:'100px', height:'auto'}}
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
      <div>
        <title>Pedro app</title>
        <link rel="icon" href="/favicon.ico" />
      </div>  
      <link rel='stylesheet' href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossOrigin="anonymous"/>
        <Layout>
          <Row>
            <div className="col-md-12">   
                <h1 className="font-weight-bold">Browse Tutorials/Courses</h1>
                <br />
            </div>
          </Row> 
          <Row>
            {listCategories()}
          </Row>
        </Layout>    
    </div>
     
  );
};
Home.getInitialProps = async () => {
  const response = await axios.get(`${process.env.API}/categories`);
  return {
    categories : response.data
  };
}
export default Home;
