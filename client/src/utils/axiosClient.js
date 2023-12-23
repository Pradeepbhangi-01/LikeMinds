import axios from "axios";
import {
  KEY_ACCESS_TOKEN,
  removeItem,
  setItem,
  getItem,
} from "./localStorageManager";

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN);
  request.headers.Authorization = `Bearer ${accessToken}`;

  return request;
});

axios.interceptors.response.use(async (response) => {
  const data = response.data;
  if (data.status === "ok") {
    return data;
  }
  const originalRequest = response.config;
  const statusCode = data.statusCode;
  const error = data.error;

  if (
    // when refresh token expires, send user to login page
    statusCode === 401 &&
    originalRequest === `${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`
  ) {
    removeItem(KEY_ACCESS_TOKEN);
    window.location.replace("/login", "_self");
    return Promise.reject(error);
  }

  if (statusCode === 401 && !originalRequest._retry) {
    // means the access token has expired

    originalRequest._retry = true;

    const response = await axios
      .create({
        withCredentials: true,
      })
      .get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`);

    if (response.status === "ok") {
      setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
      originalRequest.headers[
        "Authorization"
      ] = `Bearer ${response.data.result.accessToken}`;

      return axios(originalRequest);
    }
  }

  return Promise.reject(error);
});
