import { API_START, API_END, ACCESS_DENIED, API_ERROR, API_SUCCESS } from "../actions/types/api";
import {APIAlert, responseMessage} from '../utils/alert';


const initialState = {
	isLoadingData: false,
    stack:[],
    data:{}
}

const apiReducer = (state = initialState, action) => {
    switch (action.type) {
        case API_START:
            return {
                ...state,
                stack: [...state.stack, action.payload],
                isLoadingData: true
            };
        case API_END:
            let availableStack = [...state.stack].filter( val => val !== action.payload ); 
            return {
                ...state,
                stack: availableStack,
                isLoadingData: (availableStack.length > 0) ? true: false
            };

        case ACCESS_DENIED:
            APIAlert(action.payload.url).error();
            return {
                ...state
            };

        case API_ERROR:
            let { response, methodOfRequest } = action.payload;
            if(methodOfRequest === "POST" || methodOfRequest === "post"){
                responseMessage("error",response.data.message);
            }
            return {
                ...state
            }

        case API_SUCCESS:
            return {
                ...state
            }

        case "API_START_LOADER":
            return {
                ...state,
                isLoadingData:  true
            };

        case "API_STOP_LOADER":
            return{
                ...state,
                isLoadingData:  false  
            };

        default:
            return state;
    }
}

export default apiReducer;