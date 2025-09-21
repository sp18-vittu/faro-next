import { API } from "@/lib/api";

export const login = async (data) => {
  return API
    .post(`session/login`, data)
    .then((resp) => resp)
    .catch((err) => {
      console.log(`Login Error: \n\n${err}`);
      return err.response;
    });
};

export const getPass = async (storefront, viewPasskitPass = false) => {
  return API.post(`passes`, { 
    storefront: storefront, 
    viewPasskitPass 
  })
    .then((resp) => resp)
    .catch((err) => {
      console.log(`Get pass Error: \n\n${err}`);
      return err.response;
    });
};


export const defaultLogin = async (data, title) => {
  return API
  .post(`storefront/${title}/users/login`, data)
  .then((resp) => resp)
  .catch((err) => {
    console.log("Error: ", err)
    return err.response;
  });
}

export const signUp = async (data, title) => {
  return API
  .post(`storefront/${title}/users`, data)
  .then((resp) => resp)
  .catch((err) => {
    console.log("Error: ", err)
    return err.response;
  });
};

export const signUpWithMemberId = async (data, title) => {
  return API
  .put(`storefront/${title}/users/pre-registered`, data)
  .then((resp) => resp)
  .catch((err) => {
    console.log("Error: ", err)
    return err.response;
  });
}

export const forgotPassword = async (data, title) => {
  return API
  .put(`storefront/${title}/users/forgot-password`, data)
  .then((resp) => resp)
  .catch((err) => {
    console.log("Error: ", err)
    return err.response;
  });
}

export const updateUser = async (data, title) => {
  return API
  .put(`storefront/${title}/users/me`, data)
  .then((resp) => resp)
  .catch((err) => {
    console.log("Error: ", err)
    return err.response;
  });
}