import env from "@/constant/env";

import { API } from "@/lib/api";
const JWT_COOKIE_NAME = "jwt";
const baseURL = env.API_HOST;

export interface IPressRelease {}

export const getAllPressReleases = async (title: string, page: number) => {
  const pagination = {
    limit: 5,
    offset: page === 1 ? 0 : (page - 1) * 5,
  };
  const response = API.post(
    `${baseURL}storefront/${title}/press-releases/all`,
    {
      ...pagination,
    }
  );
  return response;
};

export const getPressRelease = async (title: string, id: string) => {
  const response = API.get(
    `${baseURL}storefront/${title}/press-releases/${id}`
  );
  return response;
};
