import React, { useState, useEffect } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import {
    CForm,
    CFormGroup,
    CLabel,
    CInput,
    CButton,
    CRow,
    CCol,
    CAlert
} from '@coreui/react';
import axios from 'axios';

const Profile = props => {

    const [ userData, setUserData ] = useState({ 
        name: '' , 
        email: '', 
        password: '', 
        cpassword: '', 
        phone: '',
        id: '',
    });
    const [, forceUpdate] = useState(0);
    const [ validator ] = useState(new SimpleReactValidator({
        element: (message, className) => <div className={"text-danger"}>{message}</div>
    }));
    const [ errors, setErrors ] = useState({});   

    const userDataChangeHandler = (e) => {
      setUserData({...userData, [e.target.name]: e.target.value});
    }

    useEffect(()=>{
        getLoggedInUserDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const getLoggedInUserDetails = () => {
        axios.get(`http://localhost:4000/users/get-logged-in-user-detail`, {
            headers : {
                Authorization: localStorage.getItem('token')
            }
        }).then(res => {
            if(res.data.user){
                const { name, email, phone, id } = res.data.user;
                setUserData({...userData, name, email, phone, id});
                setErrors({})
            }
        })
    }

    const saveUserHandler = (e) => {
        e.preventDefault();
        const { name, email, phone, password, cpassword, id } = userData;
        if (validator.allValid()) {
            axios.put('http://localhost:4000/users/update-user', {
                name,
                email,
                phone,
                password,
                password2: cpassword,
                id: id
            }, {
                headers : {
                Authorization: localStorage.getItem('token')
                }
            }).then(res => {
                getLoggedInUserDetails()
            }).catch(err => {
                setErrors(err.response.data);
            });
        } else {
          validator.showMessages();
          forceUpdate(1);
        }
    }

    return(
        <CForm action="" method="post" onSubmit={(e)=>saveUserHandler(e)}>
            {Object.values(errors).map((error, ind) => (
                <CAlert color="danger" key={ind}>
                    {error}
                </CAlert>
            ))}
            <CRow>
                <CCol sm="3">
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
                        placeholder="New Password"
                        value={userData.password}
                        onChange={userDataChangeHandler}
                        />
                        {validator.message('password', userData.password, 'min:6|max:30')}
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel htmlFor="cpassword">Confirm Password</CLabel>
                        <CInput
                        type="password"
                        id="cpassword"
                        name="cpassword"
                        placeholder="Confirm New Password"
                        value={userData.cpassword}
                        onChange={userDataChangeHandler}
                        />
                        {validator.message('confirm password', userData.cpassword, `in:${userData.password}`)}
                    </CFormGroup>
                </CCol>
            </CRow>
            <CButton type="submit" color="primary">Update</CButton>{' '}
            <CButton
                type="button"
                color="secondary"
                onClick={getLoggedInUserDetails}
            >Cancel</CButton>
        </CForm>
    );
}
        
export default Profile;  