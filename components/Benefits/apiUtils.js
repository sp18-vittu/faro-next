import API from "@/lib/api/interceptor";
import env from "@/constant/env";

const baseURL = env.API_HOST;


export const getBenefitDetails = async (storefrontTitle, benefitId) => {
  return API.get(`storefront/${storefrontTitle}/benefit/${benefitId}`)
    .then((resp) => resp)
    .catch((err) => {
      console.log(`Get Benefit threw error: \n\n${err}`);
      return err.response;
    });
};

export const getBenefitDetailsUsingFetch = async (storefrontTitle, benefitId, query) => {
  let config = { 
    next: {
      // The data will be revalidated every 3000 seconds (30 minutes)
      revalidate: 1800,
    },
  };
  const { cacheBuster, token } = query || {};
  let url = `${baseURL}storefront/${storefrontTitle}/benefit/${benefitId}`;
  if (cacheBuster || token) {
    let qs = "?";
      qs += cacheBuster ?  'cacheBuster=true' : '';
      qs += token ? cacheBuster ? `&token=${token}` : `token=${token}` : '';
      url += qs;
  }
  console.log(`Benefit API url: ${url}`);
  const response = await fetch(url, config);
  if (response.status !== 200) {
    console.log(`Error fetching benefit details: ${response.status} - ${response.statusText}`);
    throw new Error("Benefit not found!")
  }
  const testData = await response.json();
  return testData;

};

export const registerSweepstake = async (data) => {
  return API.post(`storefront/${data.storefrontTitle}/benefit/${data.benefitId}/register-sweepstake`)
    .then((resp) => resp)
    .catch((err) => {
      console.log(`Register for Sweepstake threw error: \n\n${err}`);
      return err.response;
    });
};
