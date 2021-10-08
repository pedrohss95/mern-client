import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { getCookie } from '../../../helpers/auth';
import { withAdmin } from '../../withAdmin';
import { Form, FormText, FormGroup, FormLabel, FormControl, Button, Row } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
import ReactLoading from 'react-loading';

const Links = ({ links, totalLinks, linksLimits, linkSkip, token }) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimits);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalLinks);

  const confirmDelete = (event, id) => {
    event.preventDefault();
    //console.log('delete slug');
    let answer = window.confirm('Are you sure want to delete?')
    if (answer) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${process.env.API}/link/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('link deleted ok', response);
      process.browser && window.location.reload();
    } catch (error) {
      console.log('link delete error', error);
    }
  };

  const listOfLinks = () => (
    allLinks.map((link, index) => (
      <Row className='alert alert-primary p-2' key={index}>
        <div className='col-md-8' onClick={event => handleClickCounter(link._id)}>
          <a href={link.url} target='_blank'>
            <h5 className='pt-2'>{link.title}</h5>
            <h6 className='pt-2 text-danger' style={{ fontSize: '12px' }}>
              {link.url}
            </h6>
          </a>
        </div>
        <div className='col-md-4 pt-2'>
          <span className='pull-right'>
            {moment(link.createdAt).fromNow()} by {link.postedBy.name}
          </span>
          <br />
          <span className='badge text-secondary pull-right'>
            {link.clicks} clicks
          </span>
        </div>
        <div className='col-md-12'>
          <span className='badge text-dark'>
            {link.type} / {link.medium}
          </span>
          {link.categories.map((category, index) => (
            <span key={index} className='badge text-success'>{category.name}</span>
          ))}
          <Link href={`/user/link/${link._id}`}>
            <a><span className='badge text-secondary pull-right'>Update</span></a>
          </Link>
          <span onClick={() => confirmDelete(event, link._id)} className='badge text-danger pull-right'>Delete</span>
        </div>
      </Row>
    ))
  );

  const loadMore = async () => {
    let toSkip = skip + limit;
    const response = await axios.post(`${process.env.API}/link/all`,
      {
        skip: toSkip, limit
      }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setAllLinks([...allLinks, ...response.data]);
    setSize(response.data.length);
    setSkip(toSkip);
  }

  return (
    <Layout>
      <Row>
        <div className="col-md-12">
          <h1 className="display-4 font-weight-bold">All LINKS</h1>
        </div>
      </Row>
      <br />
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={size > 0 && size >= limit}
        loader={<ReactLoading height={'20%'} width={'20%'} key={0} />}
      >
        <Row>
          <div className="col-md-12">
            {listOfLinks()}
          </div>
        </Row>
      </InfiniteScroll>
    </Layout>
  )
}

Links.getInitialProps = async ({ req }) => {
  let skip = 0;
  let limit = 2;
  const token = getCookie('token', req);

  const response = await axios.post(`${process.env.API}/link/all`, {
    skip, limit
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return {
    links: response.data,
    totalLinks: response.data.length,
    linksLimits: limit,
    linkSkip: skip,
    token
  }
}

export default withAdmin(Links);