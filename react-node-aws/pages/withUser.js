import axios from 'axios';
import { getCookie } from '../helpers/auth';

export function withUser(Page){
    const withAuthUser = props => < Page {...props} /> 
    withAuthUser.getInitialProps = async (context) => {
        const token = getCookie('token', context.req);
        let user = null
        let userLinks = [];

        if (token) {
            try {
                const response = await axios.get(`${process.env.API}/user`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                        contentType: 'application/json'
                    }
                })
                //console.log('response in with user', response)
                user = response.data.user;
                userLinks = response.data.links;
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
                token,
                userLinks
            }
        };

    };
    return withAuthUser;
}