import React, { useState, useEffect } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { connect } from 'react-redux';
import {
    CButton,
    CAlert,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow,
  } from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { forgotPassword } from '../../../actions/authActions';
import { Global } from '../../../utils/Env';
import { responseMessage } from 'src/utils/alert';

const ForgotPassword = props => {

    Global.callback.forgotPassword_onComplete = res => {
        responseMessage('success', res.message);
        setEmail("");
        props.history.push("/login");
    }

    useEffect(()=>{
        if(localStorage.getItem('token')){
          props.history.push('/dashboard');
        }
    });

    const [ validator ] = useState(new SimpleReactValidator({
        element: (message, className) => <div className={"text-danger"}>{message}</div>
    }));
    const [, forceUpdate] = useState(0);
    
    const [ email, setEmail ] = useState("");
    const [ errors ] = useState({});
    const [ success ] = useState({});
    
    const resetEmailHandler = async () => {
        if (validator.allValid()) {
            props.forgotPassword({ email });
        } else {
          validator.showMessages();
          forceUpdate(1);
        }
    }

    return(
        <div className="c-app c-default-layout flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                <CCol md="5">
                    <CCardGroup>
                    <CCard className="p-4">
                        <CCardBody>
                            <CForm>
                                <h1>Forgot Password</h1>
                                <p className="text-muted">Enter email address to reset password for</p>
                                {Object.values(errors).map((error, ind) => (
                                    <CAlert color="danger" key={ind}>
                                        {error}
                                    </CAlert>
                                ))}
                                {Object.values(success).map((success, ind) => (
                                    <CAlert color="success" key={ind}>
                                        {success}
                                    </CAlert>
                                ))}
                                <CInputGroup className="mb-3" >
                                    <CInputGroupPrepend>
                                        <CInputGroupText>
                                            <CIcon name="cil-user" />
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput type="text" placeholder="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} />
                                </CInputGroup>
                                {validator.message('email', email, 'required|email')}
                                <CRow className="mt-3">
                                    <CCol xs="6">
                                        <CButton color="primary" className="px-4" onClick={resetEmailHandler}>Reset Password</CButton>
                                    </CCol>
                                    <CCol xs="6" className="text-right">
                                        <CButton color="link" className="px-0" onClick={()=>props.history.push('/login')}>Login</CButton>
                                    </CCol>
                                </CRow>
                            </CForm>
                        </CCardBody>
                    </CCard>
                    </CCardGroup>
                </CCol>
                </CRow>
            </CContainer>
        </div>
    )
};

export default connect(null, { forgotPassword })(ForgotPassword);