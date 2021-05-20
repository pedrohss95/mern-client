import {
    useState,
    useEffect
} from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import {
    showSuccessMessage,
    showErrorMessage
} from '../../../../helpers/alerts';
import Router, {withRouter} from 'next/router';
import Layout from '../../../../components/Layout';
import {
    Button, Form, FormGroup, FormControl
} from 'react-bootstrap';
import Link from 'next/link';

const resetPassword = ({router}) =>{
    const [state,setState] = useState({
        name: '',
        token: '',
        newPassword: '',
        success: '',
        error: '',
        buttonText: 'Request Password'
    })

    const {name, token, newPassword, success, error, buttonText } = state;

    useEffect(()=>{
        const decoded = jwt.decode(router.query.id);
         if (decoded){
            setState({
                ...state,
                name: decoded.name,
                token: router.query.id
            })
        }
    },[router]);

    const handleChange = event => {
        setState({
            ...state,
            newPassword: event.target.value,
            success: '',
            error: '',
            buttonText
        });
    }

    const submitNewPassword = async event => {
        event.preventDefault();

        try {
            const response = await axios.put(`${process.env.API}/reset-password`,{
               resetPasswordLink: token,
               newPassword
            });
            //console.log('reset pw success', response)
            setState({
                ...state,
                success: response.data.message,
                buttonText: "Reset Password Done"
            });
        } catch (error) {
            console.log('reset password failed', error)
            setState({
                ...state,
                error: error.response.data.error,
                buttonText: 'Try again'
            })
        }
    }

    const resetPasswordForm = () => (
        <Form onSubmit={submitNewPassword}>
            <FormGroup>
            <FormControl onChange={handleChange} type="password" value={newPassword} placeholder="Type new password" required/>
            </FormGroup>
            <div>
             <Button variant="outline-dark" type="submit" onClick={submitNewPassword}>
                    {buttonText}
            </Button>
            </div>
        </Form>
    )
    return(
        <Layout>
            <div className="row">
                <h1>Reset Password</h1>
                <a> Hello {name}, reset your password:</a>
                <br />
                {resetPasswordForm()}
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                <Link href="/login">
                    <a className="text-dark float-ms-end">Login Page</a>
                </Link>
            </div>      
        </Layout>
    ) 
}

export default withRouter(resetPassword);