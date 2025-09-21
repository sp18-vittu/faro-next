import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import ReactMarkdown from "react-markdown";

// const ReactMarkdown = dynamic(() => import('react-markdown') as any) as any;

import { useSelectedLocaleStore } from "@/state/SelectedLocale";
import { ProgramDetailsLocales } from "@/shared/types/types";
import Section from "@/components/Section";
import { useBenefitStore } from "@/state/BenefitState";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { BenefitCard } from "../BenefitCard";
import { JapaneseTemplateName } from "@/constant";

import styles from "./style.module.scss";

export const BenefitsPage = ({ template }: { template: string }) => {
  const currentLocaleId = useSelectedLocaleStore(
    (state) => state.currentLocaleId
  );
  const benefits = useBenefitStore((state) => state.benefits);
  const programDetails = useBenefitStore((state) => state.programDetails);
  // const storefront = useStorefrontStore((state) => state.storefront);

  const [currentLocale, setCurrentLocale] =
    useState<ProgramDetailsLocales | null>(null);

  useEffect(() => {
    if (currentLocaleId && programDetails) {
      const findLocale = programDetails?.locales?.filter(
        (item) => item.localeId === currentLocaleId
      )[0];
      setCurrentLocale(findLocale);
    }
  }, [currentLocaleId, programDetails, benefits]);

  const sortBenefitsByCreateDate = () => {
    //merges the tier and collection benefits and then sorts based on benefit id
    const benefitList = benefits && benefits.map((benefit, idx) => (
      {   
        benefitId: benefit.id,
        jsxComponent: <BenefitCard
            key={`benefitCard-${benefit.id}-${idx}`}
            benefit={benefit}
            id={idx}
            template={template}
            isFullWidth
          />
        }
    ));

    benefitList.sort((a, b) => {
      if (a.benefitId > b.benefitId) {
        return -1;
      }
      if (a.benefitId > b.benefitId) {
        return 1;
      }
      return 0;
    })
    return benefitList;
  }

  return (
    <>
      {template === JapaneseTemplateName && (
        <div className={styles["benefits-heading"]}>
          <div className="container">
            {currentLocale?.name || programDetails.name}
          </div>
        </div>
      )}
      <Section
        isGray
        sectionStyles={{ paddingBottom: 30 }}
        className={
          template === JapaneseTemplateName ? styles["jap-wrapper"] : ""
        }
      >
        <div className={styles["benefits-wrapper"]}>
          {template !== JapaneseTemplateName && (
            <h2>{currentLocale?.name || programDetails.name}</h2>
          )}
          {/* <p> */}
          <ReactMarkdown className={styles.content}>
            {currentLocale?.description || programDetails.description}
          </ReactMarkdown>
          {/* </p> */}
        </div>
        <Row
          gutter={[
            { xs: 0, sm: 10 },
            { xs: 3, sm: 10 },
          ]}
          style={{ marginTop: 15 }}
        >
          {/* {benefits &&
            benefits.map((benefit, idx) => (
              <>
                <Col xxl={6} xl={8} lg={12} sm={12} xs={24}>
                  <BenefitCard
                    key={`benefitCard-${benefit.id}-${idx}`}
                    benefit={benefit}
                    id={idx}
                    template={template}
                    isFullWidth
                  />
                </Col>
              </>
            ))}
            {(hideNftCardBenefits && hideNftCardBenefits.length > 0) && (renderNftBenefits())} */}
            {sortBenefitsByCreateDate().map((sortedBenefit, idx) => (
              <>
              <Col xxl={6} xl={8} lg={12} sm={12} xs={24}>
                {sortedBenefit.jsxComponent}
              </Col>
              
              </>
            ))

            }
        </Row>
      </Section>
    </>
  );
};
