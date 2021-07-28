import Layout from '../../components/Layout';
import {withAdmin} from '../withAdmin';
import Link from 'next/link';

const Admin = ({user, token}) => {
  return (
    <div id='parent'>
      <div>
        <title>Admin Page</title>
        <link rel="icon" href="/favicon.ico" />
      </div>  
      <link rel='stylesheet' href="/styles/Home.module.css" />
      <Layout>
        <h1>Admin Dashboard</h1>
        <br/>
        <div className="row">
            <div className="col-ms-4">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link href="admin/category/create">
                    <a className="nav-link">
                      Create Category
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="admin/category/read">
                    <a className="nav-link">
                      All Categories
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-8">
              
            </div>
        </div>
      </Layout>    
    </div>
     
  )
};

export default withAdmin(Admin);
