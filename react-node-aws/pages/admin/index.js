import Layout from '../../components/Layout';
import {withAdmin} from '../withAdmin';

const Admin = (user) => {
  return (
    <div id='parent'>
      <div>
        <title>Admin Page</title>
        <link rel="icon" href="/favicon.ico" />
      </div>  
      <link rel='stylesheet' href="/static/css/styles.module.css" />
      <Layout>
        Admin Page
        {JSON.stringify(user)}
      </Layout>    
    </div>
     
  )
};

export default withAdmin(Admin);
