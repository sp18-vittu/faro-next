import React, { useEffect, useState } from "react";
import { trackPageview } from "fathom-client";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BenefitModal } from "@/components/Benefits/BenefitModal";
import { BenefitsPage } from "@/components/Benefits/BenefitsPage";
import { Footer } from "@/components/commons/Footer";
import { Header } from "@/components/commons/Header";
import env from "@/constant/env";
import { LandingPage } from "@/components/LandingPage";
import { useBenefitStore } from "@/state/BenefitState";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { useThemeStore } from "@/state/ThemeDetailsStore";
import { getStoreFrontDetails } from "@/utils/homePageApiUtils";
import { useModalStore } from "@/state/ModalStore";
import dynamic from "next/dynamic";
const PromotionModal = dynamic(() => import("@/components/PromotionModal"));
const ClaimModal = dynamic(() => import("@/components/Claim/ClaimModal"));
import { JapaneseTemplateName } from "@/constant";

import CommercialPage from "@/components/Commercial/CommercialPage/CommercialPage";

const baseURL = env.API_HOST;

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
      storefront: apiResponse.storefront,
      benefits: apiResponse.benefits,
      title,
      program: apiResponse.program,
      url: url,
      themeDetails: apiResponse.themeDetails,
    },
  };
}

export default function Home({
  storefront,
  benefits,
  program,
  url,
  themeDetails,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  const { asPath, query } = useRouter();
  const setBenefits = useBenefitStore((state) => state.setBenefits);
  const setThemeDetails = useThemeStore((state) => state.setThemeDetails);
  const setProgramDetails = useBenefitStore((state) => state.setProgramDetails);
  const setStorefront = useStorefrontStore((state) => state.setStorefront);
  const setClaimModalVisible = useModalStore(
    (state) => state.setClaimModalVisible
  );
  const setSignUp = useModalStore((state) => state.setSignUp);
  const [template] = useState(storefront?.themeId as any);

  useEffect(() => {
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
    setThemeDetails(themeDetails);
    // eslint-disable-next-line react-hooks/exhaustive-deps

    trackPageview({
      url: `${storefront?.title}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setStorefront]);

  useEffect(() => {
    if (query?.referralCode) {
      setClaimModalVisible();
      setSignUp();
    }
  }, [query.referralCode]);

  return (
    <>
      <Head>
        <title>{storefront?.heroHeadline}</title>
        <meta
          name="description"
          content={
            storefront?.heroDesc || `${storefront?.heroHeadline} description`
          }
        />
        <meta property="og:title" content={storefront?.heroHeadline} />
        <meta
          property="og:description"
          content={
            storefront?.heroDesc || `${storefront?.heroHeadline} description`
          }
        />
        <meta property="og:image" content={storefront?.heroImageUrl} />
        <meta property="og:url" content={`https://${url}${asPath}`} />
        <meta property="og:type" content="website" />
      </Head>

      <Header template={template} />
      <LandingPage template={template} />
      {template !== JapaneseTemplateName &&
        storefront?.program.tiers.length !== 0 && (
          <>
            <CommercialPage />
            <div id="benefits">
              <BenefitModal
                template={template}
              />
            </div>
          </>
        )}

      {template === JapaneseTemplateName &&
        storefront?.program.tiers.length !== 0 && (
          <>
            <div id="benefits">
              <BenefitsPage template={template} />
              <BenefitModal
                template={template}
              />
            </div>
          </>
        )}
      
      {/* <ProgramTable />
      <PointsTable /> */}
      <PromotionModal />
      <Footer template={template} />
    </>
  );
}
