import Layout from '../../components/Layout';
import axios from 'axios';
import { getCookie } from '../../helpers/auth';
import { withUser } from '../withUser';
import Link from 'next/link';
import moment from 'moment';
import link from 'next/link';
import Router from 'next/router';

const User = ({ user, token, userLinks }) => {
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
      const response = await axios.delete(`${process.env.API}/link/${id}`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      console.log('link deleted ok',response);
      Router.replace('/user');
    } catch (error) {
      console.log('link delete error', error);
    }
  }

  const listOfLinks = () => userLinks.map((link, index) => (
    <div className="row alert alert-primary p-2">
      <div className="col-md-8">
        <a href={link.url} target="_blank">
          <h5 className="p-2">
            {link.title}
          </h5>
          <h6 className="p-2 text-danger" style={{ fontSize: "12px" }}>
            {link.url}
          </h6>
        </a>
      </div>
      <div className="col-md-4 pt-2">
        <span className="pull-right">
          {moment(link.createdAt).fromNow()} by {link.postedBy.name}
        </span>
      </div>
      <div className="col-md-12">
        <span className="badge text-dark">
          {link.type}/{link.medium}
        </span>
        {link.categories.map((category, index) => (<span key={index} className="badge text-success"> {category.name}</span>))}
        <span className="badge text-secondary">{link.clicks} clicks</span>
        <Link href={`user/link/${link._id}`}>
          <span className="badge text-primary pull-right">
            Update
          </span>
        </Link>
        <span onClick={()=> confirmDelete(event,link._id)}className="badge text-danger pull-right">
          Delete
        </span>
      </div>
    </div>
  ))

  return (
    <Layout>
      <h1>
        {user.name} Dashboard - <span>{user.role}</span>
      </h1>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <ul className="nav flex-column">
            <li className="nav-item">
              <a href="/user/link/createLink" className="nav-link">
                Submit a Link
              </a>
            </li>
            <li className="nav-item">
              <Link href="/user/profile/update">
                <a className="nav-link">
                  Update Profile
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-8">
          <h2>Your Links</h2>
          <br />
          {listOfLinks()}
        </div>
      </div>
    </Layout>
  )
}

export default withUser(User);

