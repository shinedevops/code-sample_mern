import { combineReducers } from 'redux';
import apiReducer from './apiReducer';
import sideBarReducer from './sideBarReducer';
import userReducer from './userReducer';
import { reducer as form } from "redux-form";

export default combineReducers({
	api : apiReducer,
    sidebar : sideBarReducer,
	user : userReducer,
	form
});