import { API_START, API_END, ACCESS_DENIED, API_ERROR, API_SUCCESS, API } from "./types/api";


//....................................

export const apiStart = label => ({
  type: API_START,
  payload: label
});

export const apiEnd = label => ({
  type: API_END,
  payload: label
});

export const accessDenied = url => ({
  type: ACCESS_DENIED,
  payload: {
    url
  }
});

export const apiSuccess = label => ({
  type: API_SUCCESS,
  payload: label
});

export const apiError = error => ({
  type: API_ERROR,
  payload: error
});

export function apiAction({
  url = "",
  method = "GET",
  data = null,
  accessToken = localStorage.getItem("token"),
  onSuccess = () => {},
  onFailure = () => {},
  label = "",
  extraparam = {},
  callback = "",
  headersOverride = null
}) {
  
  return {
    type: API,
    payload: {
      url,
      method,
      data,
      accessToken,
      onSuccess,
      onFailure,
      label,
      extraparam,
      callback,
      headersOverride
    }
  };
}