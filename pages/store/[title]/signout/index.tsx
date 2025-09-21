import { useEffect } from "react";
import { trackPageview, trackEvent } from "fathom-client";
import { Button } from "antd";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { i18n } from "next-i18next";

import env from "@/constant/env";
import { useAppContext } from "@/context/appContext";
import { getStoreFrontDetails } from "@/utils/homePageApiUtils";
import { useBenefitStore } from "@/state/BenefitState";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { JapaneseTemplateName } from "@/constant";
import { FaroLocalStorage } from "@/utils/localStorage";

import Styles from "./signout.module.scss";

export async function getServerSideProps({ req, res, query, locale }: any) {
  const title = query.title || env.DEFAULT_STORE;
  const apiResponse = await getStoreFrontDetails(req, res, title, query);
  const url = req.headers.host;
  const localesData = await serverSideTranslations(locale, ["common"]);

  if (!apiResponse.storefront.id) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }

  return {
    props: {
      ...localesData,
      localesData: localesData,
      storefront: apiResponse.storefront,
      benefits: apiResponse.benefits,
      title,
      program: apiResponse.program,
      url: url,
    },
  };
}

const SignOut = ({
  localesData,
  storefront,
  benefits,
  title,
  program,
  url,
}: InferGetStaticPropsType<typeof getServerSideProps>) => {
  // const { logoutMagicAndUser } = useAppContext() as any;
  const router = useRouter();
  const { t } = useTranslation("common");
  const { setLoginFromDb } = useAppContext() as any;

  const setBenefits = useBenefitStore((state) => state.setBenefits);
  const setProgramDetails = useBenefitStore((state) => state.setProgramDetails);
  const setStorefront = useStorefrontStore((state) => state.setStorefront);

  useEffect(() => {
    const faroLocalStorage = new FaroLocalStorage(storefront?.title, 3);
    faroLocalStorage.removeItem("authorization");
    setLoginFromDb(false);
    setBenefits(benefits);
    setStorefront(storefront);
    setProgramDetails({
      name: program.name,
      description: program.description,
      locales: program?.locales,
      pointsEnabled: program.pointsEnabled,
      pointRewards: program.pointRewards,
      lowestTier: program.lowestTier,
    });
    trackPageview({
      url: `${storefront?.title}/signout`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setStorefront]);

  // useEffect(() => {
  //   logoutMagicAndUser();
  // }, [logoutMagicAndUser]);

  return (
    <>
      <Head>
        <title>Sign Out</title>
      </Head>

      <div className={Styles["signout-wrapper"]}>
        <div className={Styles["card"]}>
          <p>{i18n?.t("LOGGED_OUT")}</p>
          <Button
            type="primary"
            onClick={() => {
              trackEvent("Back to Home Button", { _value: 1 });
              router.push(`/store/${storefront?.title?.toLowerCase()}`);
            }}
            className={`${
              storefront?.themeId !== JapaneseTemplateName
                ? Styles["commercial-sign-out"]
                : ""
            }`}
          >
            {i18n?.t("GO_HOME")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default SignOut;
