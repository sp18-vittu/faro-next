import { API } from "@/lib/api";
import { IFaqs } from "@/shared/types/types";

export const getFaqs = async (data: any) => {
  const response = await API.post(`storefront/${data.title}/faqs/all`, data.data);
  const responseData = await response.data;
  const faqs = responseData as IFaqs;

  return faqs;
};