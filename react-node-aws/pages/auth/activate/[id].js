import { useState, useEffect} from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage} from '../../../helpers/alerts';
import {withRouter} from 'next/router';
import Layout from '../../../components/Layout'
import { Button } from 'react-bootstrap'

const activateAccount = ({router}) => {
    const [state, setState] = useState ({
        name: '',
        token: '',
        buttonText: 'Activate Account',
        success: '',
        error: ''
    })

    const {name, token, buttonText, success, error} = state;

    useEffect((name) =>{
        let token = router.query.id;
        if (token){
            const {name} = jwt.decode(token);
            setState({...state, name, token});
        }
    },[name])

    const clickSubmit = async event => {
        event.preventDefault();
        setState({...state, buttonText});
        // try {
        // const response = await axios.post(`${process.env.API}/activate`, {
        //     name, 
        //     token
        // })
        // console.log(response);
        // setState({
        //     ...state,  
        //     name: '',
        //     token: '',
        //     success: response.data.message,
        //     buttonText: 'Activated'
        // })
        // } catch (error) {
        // console.log(error);
        // setState({...state,
        //     error: error.response.data.error,
        //     buttonText: 'Please try again'
        // });
        // }
    }

    return <Layout>
            <div className="row">
                <div className="col-md-7 offset-md-0">
                    <h1>Hello {name}, let's activate your account!</h1> 
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    <Button variant="outline-dark" type="submit">
                        {buttonText}
                    </Button>
                </div>
            </div>
        </Layout>
}

export default withRouter(activateAccount)