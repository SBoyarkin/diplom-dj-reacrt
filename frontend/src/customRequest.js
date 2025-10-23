import axios from "axios";
import {FILES} from "./endpoint.js";


export const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
});


apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export function getFiles(url, dispatch, slice) {
  return apiClient.get(url)
    .then(response => {
      if (dispatch && typeof dispatch === 'function') {
        dispatch(slice(response.data));
      }
      console.log(response);
      return response.data;
    });
}


