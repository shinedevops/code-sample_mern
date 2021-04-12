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
import CIcon from '@coreui/icons-react';
import { resetPassword, CheckResetPasswordToken as checkResetPasswordToken } from '../../../actions/authActions';
import { Global } from '../../../utils/Env';
import { responseMessage } from 'src/utils/alert';

const ForgotPassword = props => {

    Global.callback.resetPassword_onComplete = res => {
        responseMessage("success", res.message);
        props.history.push('/login');
    }

    const errorFunction = () => {
        props.history.push('/login');
    }

    useEffect(()=>{
        if(localStorage.getItem('token')){
            props.history.push('/dashboard');
        }
        props.checkResetPasswordToken(props.match.params.token, errorFunction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const [ validator ] = useState(new SimpleReactValidator({
        element: (message, className) => <div className={"text-danger"}>{message}</div>,
        messages: {
            in: 'Confirm Password should be same as Password.'
        }
    }));
    const [, forceUpdate] = useState(0);
    
    const [ password, setPassword ] = useState("");
    const [ cpassword, setCPassword ] = useState("");
    const [ errors ] = useState({});
    const [ success ] = useState({});
    
    const resetPasswordHandler = async () => {
        if (validator.allValid()) {
            props.resetPassword({ token: props.match.params.token, password : password, password2 : cpassword });
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
                                <h1>Reset Password</h1>
                                <p className="text-muted">Please Enter a new password to reset</p>
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
                                            <CIcon name="cil-lock-locked" />
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                                </CInputGroup>
                                {validator.message('password', password, 'required|min:6|max:30')}
                                <CInputGroup className="mb-3 mt-3" >
                                    <CInputGroupPrepend>
                                        <CInputGroupText>
                                            <CIcon name="cil-lock-locked" />
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput type="password" placeholder="Confirm password" value={cpassword} onChange={(e)=>setCPassword(e.target.value)} />
                                </CInputGroup>
                                {validator.message('confirm password', cpassword, `required|in:${password}`)}
                                <CRow className="mt-3">
                                    <CCol xs="6">
                                        <CButton color="primary" className="px-4" onClick={resetPasswordHandler}>Reset Password</CButton>
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

export default connect(null, { resetPassword, checkResetPasswordToken })(ForgotPassword);