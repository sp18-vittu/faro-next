import API from "@/lib/api/interceptor";

export const verifyPublicToken = async () => {
  return API
    .get(`session/verify`)
    .then((resp) => resp)
    .catch((err) => {
      console.log(`Verify user: \n\n${err.response?.data?.message}`);
      return err.response;
    });
};

export const earnPoints = async (pointRelationIds, passId) => {
  return API
    .post(`passPoints/earn/${passId}`, {pointRelationIds: pointRelationIds})
    .then((resp) => resp)
    .catch((err) => {
      console.log("Error: ", err)
      return err.response;
    });
};

export const redeemBenefit = async (passId, benefitId) => {
  return API
    .post(`passPoints/redeem/${passId}/${benefitId}`, )
    .then((resp) => resp)
    .catch((err) => {
      console.log("Error: ", err)
      return err.response;
    });
};

export const redeemNft = async (passId, nftId) => {
  return API
    .post(`passPoints/redeemnft/${passId}/${nftId}`, )
    .then((resp) => resp)
    .catch((err) => {
      console.log("Error: ", err)
      return err.response;
    });
};

export const getPassOwnedItems = async (passId) => {
  return API
    .get(`passes/${passId}/benefits`)
    .then((resp) => resp)
    .catch((err) => {
      console.log("Error: ", err)
      return err.response;
    });
};


export const redeemCoupon = async (data) => {
  return API
  .post(`storefront/${data.title}/redeem`, data.data)
  .then((resp) => resp)
  .catch((err) => {
    console.log("Error: ", err)
    return err.response;
  });
}

export const isCouponredeemable = async (data) => {
  return API
  .post(`storefront/${data.title}/redeemable`, data.data)
  .then((resp) => resp)
  .catch((err) => {
    console.log("Error: ", err)
    return err.response;
  });
}

export const CanRegisterForBenefit = async (data) => {
  return API
  .post(`storefront/${data.title}/canregister`, data.data)
  .then((resp) => resp)
  .catch((err) => {
    console.log("Error: ", err)
    return err.response;
  });
}

export const getFeedback = async (data) => {
  return API
  .get(`storefront/${data.storeFrontId}/benefit/${data.benefitId}/survey-results`)
  .then((resp) => resp)
  .catch((err) => {
    console.log("Error: ", err)
    return err.response;
  });
}

export const submitFeedback = async (data) => {
  return API
  .post(`storefront/${data.storeFrontId}/benefit/${data.benefitId}/survey-results`, data.data)
  .then((resp) => resp)
  .catch((err) => {
    console.log("Error: ", err)
    return err.response;
  });
}

export const createFCMToken = async (passId, token) => {
  return API
    .post(`passes/${passId}/token`, {
      token,
      userAgent: navigator.userAgent
    })
    .then((resp) => resp)
    .catch((err) => {
      console.log("Error: ", err)
      return err.response;
    });
};

export const getBenefitNotifications = async (data) => {
  return API
  .post(`storefront/${data.storeFrontId}/notifications/all`)
  .then((resp) => resp)
  .catch((err) => {
    console.log("Error: ", err)
    return err.response;
  });
}

export const getBenefitNotification = async (data) => {
  return API
  .get(`storefront/${data.storeFrontId}/notifications/${data.notificationId}`)
  .then((resp) => resp)
  .catch((err) => {
    console.log("Error: ", err)
    return err.response;
  });
}

export const verifyEmail = async (title,data) => {
  return API
  .put(`storefront/${title}/users/verify-email`, data)
  .then((resp) => resp)
  .catch((err) => {
    console.log("Error: ", err)
    return err.response;
  });
}

export const resetPassword = async (title,data) => {
  return API
  .put(`storefront/${title}/users/reset-password`, data)
  .then((resp) => resp)
  .catch((err) => {
    console.log("Error: ", err)
    return err.response;
  });
}

export const getUserDetails = async (title) => {
  return API
  .get(`storefront/${title}/users/me`)
  .then((resp) => resp)
  .catch((err) => {
    console.log("Error: ", err)
    return err.response;
  });
}

export const getCategoriesPublic = async (title) => {
  return API
    .get(`storefront/${title}/categories`)
    .then((response) => response)
    .catch((err) => {
      console.log(
        `Get categories from DB error: \n\n${err.response?.data?.message}`
      );
      return err.response;
    });
}