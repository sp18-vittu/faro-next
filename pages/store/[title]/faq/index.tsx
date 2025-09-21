import React, { useEffect, useState } from "react";
import { trackPageview, trackEvent } from "fathom-client";
import ReactMarkdown from "react-markdown";
import { Empty, Spin, Collapse, theme, Tabs } from "antd";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CaretRightOutlined } from "@ant-design/icons";
import { i18n } from "next-i18next";

import env from "@/constant/env";
import { useBenefitStore } from "@/state/BenefitState";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { getStoreFrontDetails } from "@/utils/homePageApiUtils";
import { getFaqs } from "@/utils/faqApiUtils";

import { getStoreFrontMarketingFromClient } from "@/utils/homePageApiUtils";

import { Footer } from "@/components/commons/Footer";
import { Header } from "@/components/commons/Header";

import Styles from "./faq.module.scss";
import { JapaneseTemplateName } from "@/constant";
import { ProgramTable } from "@/components/ProgramTable";
import { PointsTable } from "@/components/PointsTable";
import { IFaqs, StorefrontMarketing } from "@/shared/types/types";
import ClaimModal from "@/components/Claim/ClaimModal";

const { Panel } = Collapse;

export async function getServerSideProps({ req, res, query, locale }: any) {
  const title = query.title || env.DEFAULT_STORE;
  query.pointRewards = false;
  query.benefits = false;
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

const Faq = ({
  localesData,
  storefront,
  benefits,
  program,
  url,
}: InferGetStaticPropsType<typeof getServerSideProps>) => {
  const { token } = theme.useToken();
  const { asPath } = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [faqs, setFaqs] = useState<IFaqs[] | null>([]);
  const setBenefits = useBenefitStore((state) => state.setBenefits);
  const setProgramDetails = useBenefitStore((state) => state.setProgramDetails);
  const setStorefront = useStorefrontStore((state) => state.setStorefront);
  const setStorefrontMarketing = useStorefrontStore(
    (state) => state.setStorefrontMarketing
  );
  const [template] = useState(storefront?.themeId as any);
  const locale = localesData?._nextI18Next?.initialLocale;
  const [tabItems, setTabItems] = useState<Array<any>>([]);

  const panelStyle = {
    marginBottom: 0,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  React.useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setStorefront]);

  useEffect(() => {
    if (storefront?.title) {
      (async () => {
        const response = await getStoreFrontMarketingFromClient(
          storefront?.title
        );
        if (response) {
          setStorefrontMarketing(response as StorefrontMarketing);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storefront]);

  useEffect(() => {
    trackPageview({
      url: `${storefront?.title}/faq`,
    });
    if (storefront.title) {
      (async () => {
        setIsLoading(true);
        const response = (await getFaqs({
          title: storefront.title,
          data: {
            filterCondition: {
              localeId:
                locale === "ja" ? "ja_JP" : locale === "pt" ? "pt_BR" : "en_US",
            },
          },
        })) as any;
        setIsLoading(false);
        setFaqs(response);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storefront, locale]);

  // Get faqs from API.
  useEffect(() => {
    const newTabItems = [
      {
        key: "1",
        label: i18n?.t("FAQ_TEXT"),
        children: (
          <div
            className="container"
            style={{ marginLeft: -15, marginRight: -15 }}
          >
            <h2
              className={`${Styles["heading"]}${
                template === JapaneseTemplateName
                  ? ` ${Styles["anime-heading"]}`
                  : ""
              }`}
            ></h2>
            {isLoading ? (
              <Spin />
            ) : (
              <>
                {faqs?.length === 0 ? (
                  <Empty />
                ) : (
                  <Collapse
                    bordered={false}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    style={{
                      background: token.colorBgContainer,
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                      marginBottom: 50,
                    }}
                    onChange={() => {
                      trackEvent("FAQ Item", { _value: 1 });
                    }}
                  >
                    {faqs?.map((item, index) => (
                      <Panel
                        header={item.question}
                        key={index}
                        style={panelStyle}
                        className={`${Styles["panel-item"]}`}
                      >
                        <ReactMarkdown className={`${Styles["description"]}`}>
                          {item.answer}
                        </ReactMarkdown>
                      </Panel>
                    ))}
                  </Collapse>
                )}
              </>
            )}
          </div>
        ),
      },
    ];

    if (storefront.enablePointsTable) {
      newTabItems.push({
        key: "2",
        label: i18n?.t("LOYALTY_PROGRAM"),
        children: (
          <div style={{ marginLeft: -15, marginRight: -15 }}>
            <ProgramTable isFaq template={template} />
          </div>
        ),
      });
    }

    if (storefront.enableProgramTable) {
      newTabItems.push({
        key: "3",
        label: i18n?.t("WAY_TO_EARN"),
        children: (
          <div style={{ marginLeft: -15, marginRight: -15 }}>
            <PointsTable isFaq template={template} />
          </div>
        ),
      });
    }
    setTabItems(newTabItems);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storefront, locale, faqs]);

  return (
    <div id="landingPage">
      <Head>
        <title>FAQ</title>
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
      <ClaimModal template={template} parentId="landingPage" />
      <div className="container">
        <Tabs
          defaultActiveKey="1"
          className={Styles["tabs"]}
          items={tabItems}
        />
      </div>
      <Footer template={template} />
    </div>
  );
};

export default Faq;
