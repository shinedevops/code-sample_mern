import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useHistory, useLocation } from 'react-router-dom'
import SimpleReactValidator from 'simple-react-validator'
import {
  // CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
} from '@coreui/react'
import axios from 'axios'
import CIcon from '@coreui/icons-react'

const validator = new SimpleReactValidator({
  element: (message, className) => <div className={"text-danger"}>{message}</div>
});

const Users = () => {
  const limit = 5;
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [ users, setUsers ] = useState([])
  const [ addUsersModal, setAddUsersModal ] = useState(false);
  const [ userData, setUserData ] = useState({ name: '', email: "", password: "", cpassword: "", phone: "" });
  const [, forceUpdate] = useState(0);


  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/users?page=${newPage}`)
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])

  useEffect(() => {
    getAllUsers();
  },[]);

  const toggle = () => {
    setAddUsersModal(!addUsersModal);
  }

  const userDataChangeHandler = (e) => {
    setUserData({...userData, [e.target.name]: e.target.value});
  }

  const getAllUsers = () => {
    axios.get('http://localhost:4000/users/get-users', {
      headers : {
        Authorization: localStorage.getItem('token')
      }
    }).then(res => {
      setUsers(res.data.users);
    }).catch(err=>console.log(err));
  }

  const deleteUser = (_id) => {
    axios.delete(`http://localhost:4000/users/delete-user/${_id}`, {
      headers : {
        Authorization: localStorage.getItem('token')
      }
    }).then(res => {
      console.log(res.data.message);
      getAllUsers();
    }).catch(err => {
      console.log(err.response);
    })
  }

  const saveUserHandler = (e) => {
    e.preventDefault();
    if (validator.allValid()) {
      const { name, email, phone, password, cpassword } = userData;
      axios.post('http://localhost:4000/users/new-user', {
        name,
        email,
        phone,
        password,
        password2: cpassword
      }, {
        headers : {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        setUserData({ name: '', email: "", password: "", cpassword: "", phone: "" });
        getAllUsers();
        setAddUsersModal(!addUsersModal);
      }).catch(err => {
        console.log(err.response.data);
      });
    } else {
      validator.showMessages();
      forceUpdate(1);
    }
  }

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            Users
            <CButton
              onClick={toggle}
              className="mr-1 float-right"
              color="primary"
            >Add New User +</CButton>
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={users}
            fields={[
              { key: 'name', _classes: 'font-weight-bold' },
              'email', 'date', 'phone',
              { key: 'delete', label: '' },
              { key: 'edit', label: '' }
            ]}
            hover
            striped
            itemsPerPage={limit}
            activePage={page}
            clickableRows
            // onRowClick={(item) => history.push(`/users/${item.id}`)}
            scopedSlots = {{
              'date':
                (item)=>(
                  <td>
                    <p>
                      {moment(item.date).format('MM/DD/yyyy')}
                    </p>
                  </td>
                ),
              'delete': 
                (item)=>(
                  <td>
                    <CButton onClick={()=>deleteUser(item._id)}><CIcon name="cil-trash" /></CButton>
                  </td>
                ),
              'edit':
                (item) => (
                  <td>
                    <CButton><CIcon name="cil-pencil" /></CButton>
                  </td>
                )
            }}
          />
          <CPagination
            activePage={page}
            onActivePageChange={pageChange}
            pages={Math.ceil(users.length/limit)}
            doubleArrows={false} 
            align="center"
          />
          </CCardBody>
        </CCard>
      </CCol>
      <CModal
        show={addUsersModal}
        onClose={toggle}
      >
        <CModalHeader closeButton>Add New User</CModalHeader>
        <CForm action="" method="post" onSubmit={saveUserHandler}>
          <CModalBody>
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
                      placeholder="Enter Password"
                      value={userData.password}
                      onChange={userDataChangeHandler}
                    />
                    {validator.message('password', userData.password, 'required|min:6|max:30')}
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="cpassword">Confirm Password</CLabel>
                    <CInput
                      type="password"
                      id="cpassword"
                      name="cpassword"
                      placeholder="Confirm Password"
                      value={userData.cpassword}
                      onChange={userDataChangeHandler}
                    />
                    {validator.message('confirm password', userData.cpassword, `required|in${userData.password}`)}
                  </CFormGroup>
              </CCol>
            </CRow>
          </CModalBody>
        <CModalFooter>
          <CButton type="submit" color="primary">Add User</CButton>{' '}
          <CButton
            color="secondary"
            onClick={toggle}
          >Cancel</CButton>
        </CModalFooter>
        </CForm>
      </CModal>
    </CRow>
  )
}

export default Users
