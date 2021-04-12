import { FETCH_USERS, FETCH_USERS_COUNT, FETCH_SINGLE_USER_DATA } from '../actions/types';

const initialState = {
    users: {},
    usersCount: {},
    singleUserData : {}
};

const userReducer = ( state = initialState, action ) => {
    switch(action.type){
        case FETCH_USERS:
            return {
                ...state,
                users: action.payload
            };
        case FETCH_USERS_COUNT:
            return {
                ...state,
                usersCount: action.payload
            };
        case FETCH_SINGLE_USER_DATA:
            return {
                ...state,
                singleUserData: action.payload
            };
        default:
            return state;
    }
}

export default userReducer;