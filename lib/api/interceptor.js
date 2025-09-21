import axios from "axios";
import env from "@/constant/env";
import { FaroLocalStorage } from "@/utils/localStorage";
import { useStorefrontStore } from "@/state/StorefrontStore";

const ApiHost = env.API_HOST;



const config = {
  baseURL: `${ApiHost}`,
  responseType: "json",
};

const axiosInstance = axios.create(config);

axiosInstance.interceptors.request.use((request) => {
  const faroLocalStorage = new FaroLocalStorage(useStorefrontStore.getState().storefront?.title || '', 3);
  const authorization = faroLocalStorage.getItem("authorization");
  if (authorization) {
    request.headers["authorization"] = authorization;
  }
  return request
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const pathName = window.location.pathname;
      let storefrontTitle = '';
      const paths = pathName.split("/");
      storefrontTitle = paths[1] === 'store' ? paths[2] : paths[1];
      const faroLocalStorage = new FaroLocalStorage(storefrontTitle || '', 3);
      faroLocalStorage.removeItem("authorization");
      window.location = "/";
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
