import { ADD_USER, DELETE_USER, UPDATE_USER, FETCH_USERS, FETCH_USERS_COUNT, FETCH_SINGLE_USER_DATA } from './types';
import { apiAction } from './apiActions';
import { responseMessage } from '../utils/alert';
const config = require('../config');


//Add New User
export const addUser = (userData) => {
    return apiAction({
        url: config.nodeBaseUrl+'new-user', 
        method: "POST",
        data: userData, 
        callback : 'addUser',
        onSuccess: setAddUser,
        onFailure: (err) => {responseMessage("error",err.response.data[Object.keys(err.response.data)[0]])},
        label: ADD_USER
    })
}

const setAddUser = (res) => {
    return {
        type: ADD_USER,
        payload: res
    }
}


//Update User
export const updateUser = (userData) => {
    return apiAction({
        url: config.nodeBaseUrl+'update-user', 
        method: "PUT",
        data: userData, 
        callback : 'updateUser',
        onSuccess: setUpdateUser,
        onFailure: (err) => {responseMessage("error",err.response.data[Object.keys(err.response.data)[0]])},
        label: UPDATE_USER
    })
}

const setUpdateUser = (res) => {
    return {
        type: UPDATE_USER,
        payload: res
    }
}

//Delete User
export const deleteUser = (id) => {
    return apiAction({
        url: config.nodeBaseUrl+`delete-user/${id}`, 
        method: "DELETE",
        callback : 'deleteUser',
        onSuccess: setDeleteUser,
        onFailure: (err) => {responseMessage("error",err.response.data[Object.keys(err.response.data)[0]])},
        label: DELETE_USER
    })
}

const setDeleteUser = (res) => {
    return {
        type: DELETE_USER,
        payload: res
    }
}

//Fetch Users
export const fetchUsers = () => {
    return apiAction({
        url: config.nodeBaseUrl+`get-users`, 
        onSuccess: setFetchUsers,
        label: FETCH_USERS
    })
}

const setFetchUsers = (res) => {
    return {
        type: FETCH_USERS,
        payload: res
    }
}

//Fetch Users Count
export const fetchUsersCount = () => {
    return apiAction({
        url: config.nodeBaseUrl+`get-users-count`, 
        onSuccess: setFetchUsersCount,
        label: FETCH_USERS_COUNT
    })
}

const setFetchUsersCount = (res) => {
    return {
        type: FETCH_USERS_COUNT,
        payload: res
    }
}

//Fetch Single User Data
export const fetchSingleUserData = (id) => {
    return apiAction({
        url: config.nodeBaseUrl+`get-user-detail/${id}`,
        callback : 'fetchSingleUserData', 
        onSuccess: setFetchSingleUserData,
        label: FETCH_SINGLE_USER_DATA
    })
}

const setFetchSingleUserData = (res) => {
    return {
        type: FETCH_SINGLE_USER_DATA,
        payload: res
    }
}
