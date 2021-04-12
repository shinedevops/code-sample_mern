import { LOGIN, FORGOT_PASSWORD, RESET_PASSWORD } from './types';
import { apiAction } from './apiActions';
import { responseMessage } from '../utils/alert';
const config = require('../config');

//Login
export const login = (userData) => {
    return apiAction({
        url: config.nodeBaseUrl+'login', 
        method: "POST",
        data: userData, 
        callback : 'login',
        onSuccess: setLogin,
        onFailure: (err) => {responseMessage("error",err.response.data[Object.keys(err.response.data)[0]])},
        label: LOGIN
    })
}

const setLogin = (res) => {
    return {
        type: LOGIN,
        payload: res
    }
}

//Forgot Password
export const forgotPassword = (email) => {
    return apiAction({
        url: config.nodeBaseUrl+'forgot-password', 
        method: "POST",
        data: email, 
        callback : 'forgotPassword',
        onSuccess: setForgotPassword,
        onFailure: (err) => {responseMessage("error",err.response.data[Object.keys(err.response.data)[0]])},
        label: FORGOT_PASSWORD
    })
}

const setForgotPassword = (res) => {
    return {
        type: FORGOT_PASSWORD,
        payload: res
    }
}

//Reset Password
export const resetPassword = (data) => {
    return apiAction({
        url: config.nodeBaseUrl+'reset-password', 
        method: "POST",
        data: data, 
        callback : 'resetPassword',
        onSuccess: setResetPassword,
        onFailure: (err) => {responseMessage("error",err.response.data[Object.keys(err.response.data)[0]])},
        label: RESET_PASSWORD
    })
}

const setResetPassword = (res) => {
    return {
        type: RESET_PASSWORD,
        payload: res
    }
}

//Check Reset Password Token
export const CheckResetPasswordToken = (token, errorFunction) => {
    return apiAction({
        url: config.nodeBaseUrl+`verify-token/${token}`, 
        onSuccess: setCheckResetPasswordToken,
        onFailure: (err) => {responseMessage("error",err.response.data[Object.keys(err.response.data)[0]]);errorFunction();},
        label: RESET_PASSWORD
    })
}

const setCheckResetPasswordToken = (res) => {
    return {
        type: RESET_PASSWORD,
        payload: res
    }
}
