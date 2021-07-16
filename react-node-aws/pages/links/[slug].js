import axios from 'axios';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getCookie } from '../../helpers/auth';
import { withUser } from '../withUser';
import { Form, FormText, FormGroup, FormLabel, FormControl, Button, Row } from 'react-bootstrap';

const Links = ({ query, category, links, totalLinks, linksLimits, linkSkip }) => {
  return (
    <Layout>
      <Row>
        <div className="col-md-8">
          Category/Links
          <br/>
          {JSON.stringify(category.name)}
        </div>
        <div className="col-md-4">
          Right Side Bar
          {JSON.stringify(links)}
        </div>
      </Row>
    </Layout>
  )
}

Links.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 2;

  const response = await axios.post(`${process.env.API}/category/${query.slug}`, {
    skip, limit
  });
  return {
    query,
    category: response.data.category,
    links: response.data.links,
    totalLinks: response.data.links.length,
    linksLimits: limit,
    linkSkip: skip
  }
}

export default Links;