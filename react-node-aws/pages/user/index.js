import Layout from '../../components/Layout';
import axios from 'axios';
import { getCookie } from '../../helpers/auth';
import { withUser} from '../withUser';

 const User = ({user, token}) => {
      return (
        <div id='parent'>
          <div>
            <title>User Page</title>
            <link rel="icon" href="/favicon.ico" />
          </div>  
          <link rel='stylesheet' href="/static/css/styles.module.css" />
          <Layout>
            User Page
            <br/>
            {JSON.stringify(user, token)}
          </Layout>    
        </div>  
      )
  }

  export default withUser(User);

