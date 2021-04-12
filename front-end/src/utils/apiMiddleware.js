
import axios from "axios";
import { API } from "../actions/types/api";
import { accessDenied, apiError, apiStart, apiEnd, apiSuccess} from "../actions/apiActions";
import {isDev, Global} from './Env';

const apiMiddleware = ({ dispatch }) => next => action => {

  next(action);

  if (action.type !== API) return;

  const {
    url,
    method,
    data,
    accessToken,
    onSuccess,
    onFailure,
    label,
    extraparam,
    callback,
    headers
  } = action.payload;

  const dataOrParams = ["GET", "DELETE"].includes(method) ? "params" : "data";

  // axios default configs
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "";
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.headers.common["Authorization"] = `${accessToken}`;

  if (label) {
    dispatch(apiStart(label));
  }
  axios
    .request({
      url,
      method,
      headers,
      [dataOrParams]: data
    })
    .then(({data}) => {
      
      if(isDev()) dispatch(apiSuccess(label));
    
      dispatch(onSuccess({...data, extraparam}));
      
      if(callback !== "") Global["callback"][callback+'_onComplete']({...data}); //
      
    }).catch(error => {
     
      let enhancedError = error;
      enhancedError.pathname = window.location.pathname;
      
      dispatch(apiError({...enhancedError,methodOfRequest:method,label : label}))

      let res = onFailure(error)

      if(res != null){
        dispatch(res)
      }

      if (error.response && error.response.status === 403) {
        dispatch(accessDenied(window.location.pathname));
      }
    }).finally(() => {
        if (label) {
            dispatch(apiEnd(label));
        }
    });
};

export default apiMiddleware;