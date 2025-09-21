import { useState, useEffect } from "react";
import { Row, Col, Button } from "antd";
import { useTranslation } from "next-i18next";
import { trackEvent } from "fathom-client";

import { CarouselSlider } from "@/components/CarouselSlider";
import { useBenefitStore } from "@/state/BenefitState";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";
import {
  Benefit,
  ProgramDetailsLocales,
  BenefitSortCriteria,
} from "@/shared/types/types";
import { BenefitCard } from "@/components/Benefits/BenefitCard";
import CategorySection from "../CategorySection";
import useWindowDimensions from "@/utils/useWindowDimensions";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { useAppContext } from "@/context/appContext";
import { getCategoryId } from "@/utils/helper";
import CategoryFilter from "../CategoryFilter";
import Spinner from "@/components/customAntd/spin";
import TableView from "../TableView";

import styles from "./home.module.scss";

interface HomeProps {
  benefitCategories: { [key: string]: Benefit[] };
  setFilterBy: (val: number) => void;
  filterBy: number | undefined;
  loading: boolean;
  tableData: Benefit[];
}
const Home = ({
  benefitCategories,
  setFilterBy,
  filterBy,
  loading,
  tableData,
}: HomeProps) => {
  const [view, setView] = useState<"list" | "grid">("grid");
  const { width } = useWindowDimensions();
  const benefits = useBenefitStore((state) => state.benefits);
  const programDetails = useBenefitStore((state) => state.programDetails);
  const currentLocaleId = useSelectedLocaleStore(
    (state) => state.currentLocaleId
  );

  const { categories } = useAppContext() as any;
  const [currentLocale, setCurrentLocale] =
    useState<ProgramDetailsLocales | null>(null);
  const [showAll, setShowAll] = useState<{
    [key: string]: { expanded: boolean };
  }>({
    coupon: { expanded: false },
    sweepstakes: { expanded: false },
    video: { expanded: false },
    audio: { expanded: false },
    digitalbook: { expanded: false },
    streams: { expanded: false },
    survey: { expanded: false },
    shopping: { expanded: false },
    dining: { expanded: false },
    entertainment: { expanded: false },
    artists: { expanded: false },
    experiences: { expanded: false },
    miscellaneous: { expanded: false },
    sports: { expanded: false },
    travel: { expanded: false },
    art: { expanded: false },
    lifestyle: { expanded: false },
    pop_culture: { expanded: false },
    business: { expanded: false },
    archives: { expanded: false },
  });

  const storefront = useStorefrontStore((state) => state.storefront);
  const { t } = useTranslation("common");

  //To set the show all state
  useEffect(() => {
    if (storefront && categories) {
      const obj: { [key: string]: { expanded: boolean } } = {};
      storefront?.benefitSortCriteria.forEach((el: BenefitSortCriteria) => {
        //Might need to use .toLowerCase here
        if (storefront?.benefitSortBy === "BenefitType" && el.benefitType) {
          obj[el.benefitType] = { expanded: false };
        } else {
          const { primaryCategoryId, name } = getCategoryId(
            categories,
            el?.categoryId
          );
          obj[name.toLowerCase()] = {
            expanded: filterBy === primaryCategoryId,
          };
        }
      });
      setShowAll(obj);
    }
  }, [storefront, categories, filterBy]);

  useEffect(() => {
    if (currentLocaleId && programDetails) {
      const findLocale = programDetails?.locales?.filter(
        (item) => item.localeId === currentLocaleId
      )[0];
      setCurrentLocale(findLocale);
    }
  }, [currentLocaleId, programDetails, benefits]);

  const showAllItems = () => {
    const newWidth = width || 600;
    if (newWidth < 576) return 3;
    if (newWidth < 768) return 3;
    if (newWidth < 1200) return 3;
    return 6;
  };

  const onViewChange = () => {
    setView(view === "grid" ? "list" : "grid");
  };

  return loading ? (
    <div className="container">
      <Spinner size="small" style={{ margin: "30px auto" }} />
    </div>
  ) : (
    <>
      {Object.keys(benefitCategories).length > 0 && (
        <CategoryFilter
          setFilterBy={setFilterBy}
          value={filterBy}
          view={view}
          onViewChange={onViewChange}
        />
      )}
      {view === "grid" ? (
        <>
          {Object.entries(benefitCategories).map(
            ([category, benefits]: [string, Benefit[]]) => {
              return (
                benefits?.length > 0 && (
                  <CategorySection
                    title={`${t(
                      `${
                        category === "digitalbook"
                          ? "PDF"
                          : category === "archive"
                          ? "ARCHIVE_HEADING"
                          : category.toUpperCase()
                      }`
                    )}`.toUpperCase()}
                    id={`${category}-section`}
                    extra={
                      benefits.length > showAllItems() && (
                        <Button
                          onClick={() =>
                            setShowAll((prev) => {
                              if (!prev[category].expanded) {
                                trackEvent(`${category} show all`, {
                                  _value: 1,
                                });
                              }
                              return {
                                ...prev,
                                [category]: {
                                  expanded: !showAll[category].expanded,
                                },
                              };
                            })
                          }
                          className={styles["see-all"]}
                          type="link"
                        >
                          {showAll[category]?.expanded
                            ? `${t("SEE_LESS")}`
                            : `${t("SEE_ALL")}`}
                        </Button>
                      )
                    }
                  >
                    {showAll[category]?.expanded ? (
                      <Row gutter={[20, 20]}>
                        {benefits.map((benefit: Benefit) => {
                          return (
                            <Col
                              key={benefit.id}
                              xs={8}
                              sm={8}
                              md={6}
                              xl={6}
                              style={{
                                paddingLeft: "7.5px",
                                paddingRight: "0px",
                              }}
                            >
                              <BenefitCard
                                benefit={benefit}
                                id={benefit.id}
                                template={storefront?.themeId}
                                border={false}
                              />
                            </Col>
                          );
                        })}
                      </Row>
                    ) : (
                      <CarouselSlider
                        benefitList={benefits}
                        template={storefront?.themeId}
                      />
                    )}
                    {showAll[category]?.expanded && (
                      <Button
                        onClick={() => {
                          setShowAll((prev) => ({
                            ...prev,
                            [category]: { expanded: false },
                          }));
                        }}
                        type="link"
                        className={`${styles["see-all"]} ${styles["less"]}`}
                      >
                        {`${t("SEE_LESS")}`}
                      </Button>
                    )}
                  </CategorySection>
                )
              );
            }
          )}
        </>
      ) : (
        // <TableView
        //   allSweepstakes={tableData}
        //   setFilterBy={setFilterBy}
        //   filterBy={filterBy}
        //   loading={loading}
        // />
        <></>
      )}
    </>
  );
};

export default Home;
