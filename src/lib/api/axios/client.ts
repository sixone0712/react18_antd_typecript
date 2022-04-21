import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { ACCESS_TOKEN_NAME, API_URL, PAGE_URL, REFRESH_TOKEN_NAME, SESSION_STORAGE_EXPIRED } from '../../constants';

const client = axios.create();

client.defaults.baseURL = process.env.NODE_ENV === 'development' ? '' : '';
client.defaults.withCredentials = true;

// Function that will be called to refresh authorization
const refreshAuthLogic = (failedRequest: any) =>
  axios
    .post(API_URL.POST_AUTH_REISSUE)
    .then((tokenRefreshResponse) => {
      return Promise.resolve();
    })
    .catch((error) => {
      deleteCookie(ACCESS_TOKEN_NAME);
      deleteCookie(REFRESH_TOKEN_NAME);
      window.sessionStorage.setItem(SESSION_STORAGE_EXPIRED, 'true');
      window.location.replace(PAGE_URL.LOGIN_ROUTE);
    });

createAuthRefreshInterceptor(client, refreshAuthLogic);

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; ;path=/`;
}

// reference: https://gist.github.com/Godofbrowser/bf118322301af3fc334437c683887c5f
// let isRefreshing = false;
// let failedQueue: any = [];

// const processQueue = (error: any) => {
//   failedQueue.forEach((prom: any) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve();
//     }
//   });

//   failedQueue = [];
// };

// client.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise(function (resolve, reject) {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((res) => {
//             return axios(originalRequest);
//           })
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       return new Promise(function (resolve, reject) {
//         axios
//           .post(API_URL.POST_AUTH_REISSUE)
//           .then((res) => {
//             processQueue(null);
//             resolve(axios(originalRequest));
//           })
//           .catch((err) => {
//             processQueue(err);
//             reject(err);
//             document.cookie = `${ACCESS_TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; ;path=/`;
//             document.cookie = `${REFRESH_TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; ;path=/`;
//             window.location.replace(PAGE_URL.LOGIN_ROUTE);
//           })
//           .finally(() => {
//             isRefreshing = false;
//           });
//       });
//     }

//     return Promise.reject(error);
//   }
// );

export default client;
