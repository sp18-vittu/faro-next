import axios from "axios";
import env from "@/constant/env";
import { API } from "@/lib/api";

const baseURL = env.API_HOST;

export const getUserStreak = async (passId) => {
  return API.get(`passes/${passId}/streakrewards`)
    .then((resp) => resp)
    .catch((err) => {
      console.log(`Get user streak Error: \n\n${err}`);
      return err.response;
    });
};
