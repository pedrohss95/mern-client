import axios from 'axios';
import { getCookie } from '../helpers/auth';

export function withAdmin(Page){
    const withAdminUser = props => < Page {...props} /> 
    withAdminUser.getInitialProps = async (context) => {
        const token = getCookie('token', context.req);
        let user = null

        if (token) {
            try {
                const response = await axios.get(`${process.env.API}/admin`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                        contentType: 'application/json'
                    }
                })
                user = response.data
            } catch (error) {
                if (error.response.status === 401) {
                   user = null
                }
            }
        }

        if (user === null){
            // redirect
            context.res.writeHead(302,{
                Location: "/"
            });
            context.res.end();
        } else {
            return { 
                ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
                user, 
                token
            }
        };

    };
    return withAdminUser;
}