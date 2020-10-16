import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.spotify.com/v1",
});
axios.interceptors.response.use(function (res) {
  return res;
}, function(error) {
  return Promise.reject(error)
})