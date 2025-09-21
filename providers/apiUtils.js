import axios from "axios";

import env from "@/constant/env";

const baseURL = env.API_HOST;

export const addNonce = async (data) => {
  return axios
    .post(`${baseURL}session/nonce`, data)
    .then((resp) => resp)
    .catch((err) => {
      console.log(`Add SIWE Nonce: \n\n${err.response?.data?.message}`);
      return err.response;
    });
};

export const loginWithPersonalSign = async (data) => {
  return axios
    .post(`${baseURL}session/login`, data)
    .then((resp) => resp)
    .catch((err) => {
      console.log(`Login Personal Sign: \n\n${err.response?.data?.message}`);
      return err.response;
    });
};
