import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Layout from '../../components/Layout';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { getCookie } from '../../helpers/auth';
import { withUser } from '../withUser';
import { Form, FormText, FormGroup, FormLabel, FormControl, Button, Row } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
import ReactLoading from 'react-loading';

const Links = ({ query, category, links, totalLinks, linksLimits, linkSkip }) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimits);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalLinks);

  const handleClickCounter = async (linkId) => {
    const response = await axios.put(`${process.env.API}/click-counter`, { linkId });
    loadUpdatedLinks();
  };
  const loadUpdatedLinks = async () => {
    const response = await axios.post(`${process.env.API}/category/${query.slug}`)
    setAllLinks(response.data.links);
  }
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
        <div className='col-md-4'>
          <span className='pull-right'>
            {moment(link.createdAt).fromNow()} by {link.postedBy.name}
          </span>
          <div className='col-md-12'>
            <span className='badge text-secondary pull-right'>
              {link.clicks} clicks
            </span>
          </div>
        </div>
        <div className='col-md-12'>
          <span className='badge text-dark'>
            {link.type} / {link.medium}
          </span>
          {link.categories.map((category, index) => (
            <span key={index} className='badge text-success'>{category.name}</span>
          ))}
        </div>
      </Row>
    ))
  );

  const loadMore = async () => {
    let toSkip = skip + limit;
    const response = await axios.post(`${process.env.API}/category/${query.slug}`,
      {
        skip: toSkip, limit
      });
    setAllLinks([...allLinks, ...response.data.links]);
    setSize(response.data.links.length);
    setSkip(toSkip);
  }

  // const loadMoreButton = () => {
  //   return (
  //     size > 0 && size >= limit && (
  //       <Button onClick={loadMore}>Load more Links</Button>
  //     )
  //   )
  // };
  return (
    <Layout>
      <Row>
        <div className="col-md-8">
          <h1 className="display-4 font-weight-bold">{category.name} - URL/LINKS</h1>
          <div className="lead alert alert-secondary pt-4">{renderHTML(category.content)}</div>
        </div>
        <div className="col-md-4">
          <img src={category.image.url} alt={category.name} style={{ width: 'auto', maxHeight: '200px' }} />
        </div>
      </Row>
      <br />
      {/* <Row>
        <div className="col-md-8">
          {listOfLinks()}
        </div>
        <div className="col-md-4">
          <h2>Most Popular in {category.name}</h2>
          <p>Show Pop Links</p>
        </div>
      </Row> */}
      {/* <div className="col-md-4">
        {loadMoreButton()}
      </div> */}
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={size > 0 && size >= limit}
        loader={<ReactLoading height={'20%'} width={'20%'} key={0} />}
      >
        <Row>
          <div className="col-md-8">
            {listOfLinks()}
          </div>
          <div className="col-md-4">
            <h2>Most Popular in {category.name}</h2>
            <p>Show Pop Links</p>
          </div>
        </Row>
      </InfiniteScroll>
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