import React from "react";
import { Row, Col } from "antd";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

import TopicImage from "../../public/images/topic-heading.png";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";
import { CommercialTemplateName, JapaneseTemplateName } from "@/constant";

import { CarouselSlider } from "../CarouselSlider";
import Section from "../Section";

import dynamic from "next/dynamic";
const MarketingModal = dynamic(() => import("@/components/MarketingModal"));
const ClaimModal = dynamic(() => import("../Claim/ClaimModal"));

import styles from "./style.module.scss";
import HeroImages from "../Commercial/HeroSection";
import CommercialHeroSection from "../Commercial/HeroSection";

export const LandingPage = ({
  template = CommercialTemplateName,
}: {
  template?: string;
}) => {
  const storefront = useStorefrontStore((state) => state.storefront);
  const currentStorefrontLocale = useSelectedLocaleStore(
    (state) => state.currentStorefrontLocale
  );

  return template !== JapaneseTemplateName ? (
    <>
      {storefront?.heroImages && storefront?.heroImages?.length === 0 && (
        <div className={styles["jap-hero-image"]}>
          <Image
            src={storefront?.heroImageUrl || ""}
            alt=""
            width={960}
            height={500}
            //fill={true}
          />
        </div>
      )}
    </>
  ) : (
    <div
      id="landingPage"
      className={`${styles["hero-section"]}${
        template === JapaneseTemplateName
          ? ` ${styles["jap-hero-section"]}`
          : ""
      }`}
    >
      <ClaimModal template={template} parentId="landingPage" />
      <MarketingModal />
      {template === JapaneseTemplateName ? (
        <>
          <div className={styles["jap-hero-image"]}>
            <Image
              src={storefront?.heroImageUrl as string}
              alt=""
              width={960}
              height={500}
            />
          </div>
          {storefront?.showBenefitsCarousel && (
            <div className={styles["topic-slider"]}>
              <div className="container">
                <h2>
                  <Image src={TopicImage} width={261} height={51} alt="topic" />
                </h2>
                <CarouselSlider template={template} />
              </div>
            </div>
          )}
        </>
      ) : (
        <Section className={styles.section}>
          <Row>
            <Col xs={24} xl={12} span={12}>
              <h1>
                {currentStorefrontLocale?.heroHeadline ||
                  storefront?.heroHeadline}
              </h1>
              {(currentStorefrontLocale?.heroDesc || storefront?.heroDesc) && (
                <p>
                  <ReactMarkdown>
                    {currentStorefrontLocale?.heroDesc ||
                      storefront?.heroDesc ||
                      ""}
                  </ReactMarkdown>
                </p>
              )}
              {/* <Link href="">Learn more</Link> */}
              <div className={styles["hero-image-desktop"]}>
                {storefront?.heroImageUrl && (
                  <Image
                    src={storefront.heroImageUrl}
                    fill
                    alt={
                      currentStorefrontLocale?.heroHeadline ||
                      storefront?.heroHeadline
                    }
                  />
                )}
              </div>
              <hr className={styles.hr} />
              {(storefront?.heroBenefitsHeadline ||
                currentStorefrontLocale?.heroBenefitsHeadline) && (
                <h2>
                  {currentStorefrontLocale?.heroBenefitsHeadline ||
                    storefront?.heroBenefitsHeadline}
                </h2>
              )}
              {(storefront?.heroBenefitsDescription ||
                currentStorefrontLocale?.heroBenefitsDescription) && (
                <h3>
                  <ReactMarkdown>
                    {currentStorefrontLocale?.heroBenefitsDescription ||
                      storefront?.heroBenefitsDescription ||
                      ""}
                  </ReactMarkdown>
                </h3>
              )}
              <CarouselSlider />
            </Col>
            <Col
              xxl={{ offset: 3, span: 9 }}
              xl={{ offset: 2, span: 10 }}
              md={{ offset: 0, span: 0 }}
              sm={{ offset: 0, span: 0 }}
              xs={{ offset: 0, span: 0 }}
            >
              <div className={styles["hero-image"]}>
                {storefront?.heroImageUrl && (
                  <Image
                    src={storefront.heroImageUrl}
                    fill
                    alt={
                      currentStorefrontLocale?.heroHeadline ||
                      storefront?.heroHeadline
                    }
                  />
                )}
              </div>
            </Col>
          </Row>
        </Section>
      )}
    </div>
  );
};
