import axios from "axios";
import store from './store/index';
import { storeAuthState } from "./store/actions/auth";

export const api = axios.create({
  baseURL: "https://api.spotify.com/v1",
});
api.interceptors.response.use(function (res) {
  return res;
}, function(error) {
  const originalRequest = error.config;
  console.log(error.response);
  if(error.response.status === 401 && !originalRequest._retry) {
    const { dispatch } = store;
    originalRequest._retry = true;
    return axios.get(`https://spoty-back.herokuapp.com/refresh_token?refresh_token=${window.localStorage.getItem("refreshToken")}`)
    .then(res => {
      dispatch(storeAuthState(res.data.access_token, window.localStorage.getItem("refreshToken")));
      originalRequest.headers["Authorization"] = 'Bearer ' + res.data.access_token;
      return api(originalRequest)
    } )
    .catch(err => console.log(err));
  }
  return Promise.reject(error)
})