import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import UserForm from './UserForm';
import {
  addUser,
  updateUser,
  deleteUser,
  fetchUsers,
  fetchSingleUserData
} from '../../actions/userActions';
import { Global } from '../../utils/Env';

const Users = props => {


  Global.callback.addUser_onComplete = () => {
    props.fetchUsers();
    toggle();
    modalTypeChangeToAdd();
  }

  Global.callback.updateUser_onComplete = () => {
    props.fetchUsers();
    toggle();
    modalTypeChangeToAdd();
  }

  Global.callback.deleteUser_onComplete = () => {
    props.fetchUsers();
  }

  Global.callback.fetchSingleUserData_onComplete = res => {
    if(res.user){
      const { name, email, phone, id } = res.user;
      setFetchedUserData({name, email, phone, id});
      setAddUserModalType(false);
      setErrors({});
      toggle();
    }
  }


  const limit = 5;
  const history = useHistory()
  const currentPage = props.match.params.pg ? Number(props.match.params.pg) : 1;
  const [page, setPage] = useState(currentPage)
  const [ addUsersModal, setAddUsersModal ] = useState(false);
  const [ fetchedUserData, setFetchedUserData ] = useState({
    name: '' , 
    email: '', 
    phone: '',
    id:'',
  });
  const [ addUserModalType, setAddUserModalType ] = useState(true);
  const [ errors, setErrors ] = useState({});

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/users/page/${newPage}`)
  }

  const modalTypeChangeToAdd = () => {
    setAddUserModalType(true);
    setFetchedUserData({
      name: '' , 
      email: '', 
      phone: '',
      id:'',
    });
    setErrors({});
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])

  useEffect(() => {
    props.fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const toggle = () => {
    setAddUsersModal(!addUsersModal);
  }

  const saveUserData = userData => {
    const { name, email, phone, password, cpassword, id } = userData;
    if(!id){
      props.addUser({ name, email, phone, password, password2: cpassword });
    }else{
      props.updateUser({ name, email, phone, password, password2: cpassword, id: id });
    }
  }

  const getUserData = (id) => {
    props.fetchSingleUserData(id);
  }

  const deleteUser = (_id) => {
    props.deleteUser(_id);
  }

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            Users
            <CButton
              onClick={()=>{modalTypeChangeToAdd();toggle();}}
              className="mr-1 float-right"
              color="primary"
            >Add New User +</CButton>
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={props.users.users ? props.users.users : []}
            fields={[
              { key: 'name', _classes: 'font-weight-bold' },
              'email', 'date', 'phone',
              { key: 'actions', label: 'Actions' }
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
              'actions': 
                (item)=>(
                  <td>
                    <CButton onClick={()=>getUserData(item._id)}><CIcon name="cil-pencil" /></CButton>
                    <CButton onClick={()=>deleteUser(item._id)}><CIcon name="cil-trash" /></CButton>
                  </td>
                )
            }}
          />
          <CPagination
            activePage={page}
            onActivePageChange={(newpage)=>pageChange(newpage)}
            pages={Math.ceil((props.users.users ? props.users.users.length : 0)/limit) || 1}
            doubleArrows={false} 
            align="center"
          />
          </CCardBody>
        </CCard>
      </CCol>
      {addUsersModal ? 
        <UserForm 
          addUsersModal={addUsersModal} 
          toggle={toggle} 
          title={addUserModalType ? "Add New User" : "Update User Data"}   
          saveButtonTitle={addUserModalType ? "Add" : "Update"}
          userData={fetchedUserData}
          saveUserData={saveUserData}
          errors={errors}
        />
      : null}
    </CRow>
  )
}

const mapStateToProps = state => ({
  users: state.user.users,
  singleUserData: state.user.singleUserData
})

export default connect(mapStateToProps, { addUser, updateUser, deleteUser, fetchSingleUserData, fetchUsers })(Users);
