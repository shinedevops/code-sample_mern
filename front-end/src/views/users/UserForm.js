import React, { useState, useEffect } from 'react';
import SimpleReactValidator from 'simple-react-validator'
import {
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CForm,
    CFormGroup,
    CLabel,
    CInput,
    CButton,
    CRow,
    CCol,
    CAlert
} from '@coreui/react';


const UserForm = props => {
    
    const [ userData, setUserData ] = useState({ 
        name: props.userData.name ? props.userData.name : '' , 
        email: props.userData.email ? props.userData.email : '', 
        password: '', 
        cpassword: '', 
        phone: props.userData.phone ? props.userData.phone : '',
        id: props.userData.id ? props.userData.id : '',
    });
    const [, forceUpdate] = useState(0);
    const [ validator ] = useState(new SimpleReactValidator({
        element: (message, className) => <div className={"text-danger"}>{message}</div>,
        messages: {
            in: 'Confirm Password should be same as Password.'
        }
    }));
    const [ errors, setErrors ] = useState({});

    useEffect(()=>{
        setErrors(props.errors);
    },[props.errors]);      

    const userDataChangeHandler = (e) => {
      setUserData({...userData, [e.target.name]: e.target.value});
    }

    const saveUserHandler = async (e) => {
        e.preventDefault();
        if (validator.allValid()) {
            props.saveUserData(userData);
        } else {
          validator.showMessages();
          forceUpdate(1);
        }
    }

    return(
        <CModal
            show={props.addUsersModal}
            onClose={props.toggle}
        >
            <CModalHeader closeButton>{props.title}</CModalHeader>
            <CForm action="" method="post" onSubmit={saveUserHandler}>
                <CModalBody>
                    {Object.values(errors).map((error, ind) => (
                        <CAlert color="danger" key={ind}>
                            {error}
                        </CAlert>
                    ))}
                    <CRow>
                        <CCol sm="12">
                            <CFormGroup>
                                <CLabel htmlFor="name">Name</CLabel>
                                <CInput
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter Name"
                                value={userData.name}
                                onChange={userDataChangeHandler}
                                />
                                {validator.message('name', userData.name, 'required|min:2')}
                            </CFormGroup>
                            <CFormGroup>
                                <CLabel htmlFor="email">Email</CLabel>
                                <CInput
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter Email"
                                value={userData.email}
                                onChange={userDataChangeHandler}
                                />
                                {validator.message('email', userData.email, 'required|email')}
                            </CFormGroup>
                            <CFormGroup>
                                <CLabel htmlFor="phone">Phone</CLabel>
                                <CInput
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="Enter Phone"
                                value={userData.phone}
                                onChange={userDataChangeHandler}
                                />
                                {validator.message('phone', userData.phone, 'required|phone')}
                            </CFormGroup>
                            <CFormGroup>
                                <CLabel htmlFor="password">Password</CLabel>
                                <CInput
                                type="password"
                                id="password"
                                name="password"
                                placeholder={!userData.id ? "Enter Password" : "New Password"}
                                value={userData.password}
                                onChange={userDataChangeHandler}
                                />
                                {validator.message('password', userData.password, !userData.id ? 'required|min:6|max:30' : 'min:6|max:30')}
                            </CFormGroup>
                            <CFormGroup>
                                <CLabel htmlFor="cpassword">Confirm Password</CLabel>
                                <CInput
                                type="password"
                                id="cpassword"
                                name="cpassword"
                                placeholder={!userData.id ? "Confirm Password" : "Confirm New Password"}
                                value={userData.cpassword}
                                onChange={userDataChangeHandler}
                                />
                                {validator.message('cpassword', userData.cpassword, !userData.id ? `required|in:${userData.password}` : `in:${userData.password}`)}
                            </CFormGroup>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton type="submit" color="primary">{props.saveButtonTitle}</CButton>{' '}
                    <CButton
                        type="button"
                        color="secondary"
                        onClick={props.toggle}
                    >Cancel</CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
}

export default UserForm;