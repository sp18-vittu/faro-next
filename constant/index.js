import React from "react";
import Image from "next/image";

import env from "@/constant/env";
import USAFlag from "../public/images/united-states.png";
import JapanFlag from "../public/images/japan.png";
import SpainFlag from "../public/images/spain.png";
import IndiaFlag from "../public/images/india.png";
import BrazilFlag from "../public/images/brazil-flag.png";


export const LOCALE_DETAILS = [
  {
    label: "English",
    icon: <Image src={USAFlag} alt="USA flag" width={20} height={20} />,
    title: "",
    localeId: "en_US",
  },
  {
    label: "日本語",
    icon: <Image src={JapanFlag} alt="Japan flag" width={20} height={20} />,
    title: "", //"日本語",
    localeId: "ja_JP",
  },
  {
    label: "Español",
    icon: <Image src={SpainFlag} alt="Spain flag" width={20} height={20} />,
    title: "",
    localeId: "es_US",
  },
  {
    label: "Hindi",
    icon: <Image src={IndiaFlag} alt="India flag" width={20} height={20} />,
    title: "",
    localeId: "hi_IN"
  },
  {
    label: "Português",
    icon: <Image src={BrazilFlag} alt="Brazil flag" width={20} height={20} />,
    title: "",
    localeId: "pt_BR"
  },
];


export const localeMapping = {
  ja: "ja_JP",
  hi: "hi_IN",
  es: "es_US",
  en: "en_US",
  pt: "pt_BR",
}

export const JapaneseTemplateName = "Anime";
export const CommercialTemplateName = "Commercial";