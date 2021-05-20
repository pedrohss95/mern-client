import {
    useState
} from 'react';
import axios from 'axios';
import {
    showSuccessMessage,
    showErrorMessage
} from '../../../helpers/alerts';
import Router from 'next/router';
import Layout from '../../../components/Layout'
import {
    Button, Form, FormGroup,FormControl
} from 'react-bootstrap'

const forgotPassword = () => {
    const [state, setState] = useState({
        email: '',
        buttonText: 'Forgot Password',
        success: '',
        error: ''
    })

    const {
        email,
        buttonText,
        success,
        error
    } = state;

    const handleChange = event => {
        setState({
            ...state,
            email: event.target.value,
            error: '', 
            success: ''
        })
    }

    const handleSubmit = async event => {
        event.preventDefault();
        setState({
            ...state,
            buttonText: 'Sending email'
        })
        try {
            const response = await axios.put(`${process.env.API}/forgot-password`, {
                email
            });
            console.log(response, 'requesting new password');
            setState({
                ...state,
                email:'',
                success: response.data.message,
                buttonText: 'Email sent'
            });
        } catch (error) {
            console.log('forgot password error', error);
            setState({...state,
                error: error.response.data.error,
                buttonText: 'Please try again'
            });
        }
    }

    const forgotPasswordForm = () => (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
            <FormControl onChange={handleChange} type="email" value={email} placeholder="Type your email" required/>
            </FormGroup>
            <div>
             <Button variant="outline-dark" type="submit" onClick={handleSubmit}>
                    {buttonText}
            </Button>
            </div>
        </Form>
    )

    return(
         <Layout>
            <div className="row">
                    <h1>Forgot Password</h1>
                    <br />
                    {forgotPasswordForm()}
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
            </div>
        </Layout>
    )
}

export default forgotPassword;