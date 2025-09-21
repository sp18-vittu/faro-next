import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Tabs, message } from "antd";
import { BellOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";

import { useCommercialPageStore } from "@/state/CommercialPage";
import { useBenefitStore } from "@/state/BenefitState";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";
import { ProgramDetailsLocales, Benefit } from "@/shared/types/types";
import { useAppContext } from "@/context/appContext";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { sortBenefits } from "@/utils/commercialTheme";
import { getArchivedSweepstakes } from "@/utils/homePageApiUtils";

import Home from "./home";
import News from "./news";
import Profile from "./profile";
import TableView from "../TableView";
import CommercialHeroSection from "../HeroSection";

import styles from "./style.module.scss";

const ClaimModal = dynamic(() => import("../../Claim/ClaimModal"));

const CommercialPage = () => {
  const [currentLocale, setCurrentLocale] =
    useState<ProgramDetailsLocales | null>(null);
  const [archivedSweepstakes, setArchivedSweepstakes] = useState<Benefit[]>();
  const [tableData, setTableData] = useState<Benefit[]>([]);
  const [filterBy, setFilterBy] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTabKey, setActiveTabKey] = useState<string>("Home");

  const { loginFromDb, categories } = useAppContext() as any;
  const [messageApi, contextHolder] = message.useMessage();
  const benefits = useBenefitStore((state) => state.benefits);
  const programDetails = useBenefitStore((state) => state.programDetails);
  const storefront = useStorefrontStore((state) => state.storefront);
  const currentLocaleId = useSelectedLocaleStore(
    (state) => state.currentLocaleId
  );
  const { page, benefitCategories, setBenefitCategories } =
    useCommercialPageStore((state) => ({
      page: state.page,
      benefitCategories: state.benefitCategories,
      setBenefitCategories: state.setBenefitCategories,
    }));
  useEffect(() => {
    setActiveTabKey(page);
  }, [page]);

  const { t } = useTranslation("common");

  const handleTabChange = (key: string) => {
    const loginRequired = !["Home", "List"].includes(key);
    if (loginRequired && !loginFromDb) {
      // User is not logged in, show a warning message
      messageApi.open({
        type: "warning",
        content: t("LOGIN_TO_PROCEED"),
        duration: 2,
      });
    } else {
      setActiveTabKey(key);
    }
  };

  useEffect(() => {
    if (currentLocaleId && programDetails) {
      const findLocale = programDetails?.locales?.filter(
        (item) => item.localeId === currentLocaleId
      )[0];
      setCurrentLocale(findLocale);
    }
  }, [currentLocaleId, programDetails, benefits]);

  useEffect(() => {
    if (!archivedSweepstakes && !loading) {
      (async () => {
        if (storefront?.title) {
          setLoading(true);
          const archivedSweepstakes: Benefit[] =
            (await getArchivedSweepstakes(storefront.title)) || [];
          /*The table only shows sweepstakes(lottery) so expanding the sweepstakes 
          and then expanding archives which are the past sweepstakes.
          */
          setArchivedSweepstakes(archivedSweepstakes);
          setLoading(false);
        }
      })();
    }

    if (
      benefits.length > 0 &&
      storefront &&
      categories?.length > 0 &&
      Object.keys(benefitCategories).length === 0 &&
      !loading
    ) {
      const sortedBenefits =
        sortBenefits(benefits, categories, storefront) || {};
      sortedBenefits.archive = archivedSweepstakes || [];
      setBenefitCategories(sortedBenefits);
      setTableData([...benefits, ...(archivedSweepstakes || [])]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefits, categories, archivedSweepstakes]);

  // Handle category change
  useEffect(() => {
    if (storefront && benefits && !loading) {
      let obj = {};
      const sortedBenefits =
        sortBenefits(
          [...benefits, ...(archivedSweepstakes || [])],
          categories,
          storefront
        ) || {};
      /*If one filter is applied then benefitCategories does not contain
      the other categories. So getting all sorted benefits everytime filter is changed.
      */
      if (filterBy) {
        // Not blank
        const categoryName = categories.filter(
          (el: any) => el.id === filterBy
        )[0].name;
        /*Category name  is required because benefit categories has it as the key
           and the corresponding benefits as the value
           */
        obj = {
          [`${categoryName.toLowerCase()}`]:
            sortedBenefits[categoryName.toLowerCase()],
          archive: benefitCategories.archive,
        };
      } else {
        sortedBenefits.archive = archivedSweepstakes || [];
        obj = sortedBenefits;
      }
      setBenefitCategories(obj);
      setTableData((prev) => {
        if (filterBy) {
          return prev.filter((el: Benefit) => el?.category?.id === filterBy);
        } else {
          return [...benefits, ...(archivedSweepstakes || [])];
        }
      });
    }
  }, [filterBy]);

  return (
    <>
      {contextHolder}
      <div id="commercialPage">
        <ClaimModal template={storefront?.themeId} parentId="commercialPage" />
        {storefront?.showProgramName && (
          <div className={styles["title-container"]}>
            <p className={`${styles["title"]} container`}>
              {currentLocale?.name || programDetails.name}
            </p>
          </div>
        )}
        <CommercialHeroSection setFilterBy={setFilterBy} filterBy={filterBy} />
        <Tabs
          className={`${styles["tab-container"]}`}
          defaultActiveKey="Home"
          activeKey={activeTabKey}
          onChange={(key) => {
            handleTabChange(key);
          }}
          items={[
            {
              label: (
                <div className={styles["tab-label"]}>
                  <HomeOutlined />
                  {/* <p>{t("HOME")}</p> */}
                  <p>HOME</p>
                </div>
              ),
              key: "Home",
              children: (
                <Home
                  tableData={tableData}
                  benefitCategories={benefitCategories}
                  setFilterBy={setFilterBy}
                  filterBy={filterBy}
                  loading={loading}
                />
              ),
            },
            {
              label: (
                <div className={styles["tab-label"]}>
                  <BellOutlined />
                  <p>NEWS</p>
                </div>
              ),
              key: "News",
              children: loginFromDb ? <News /> : null,
            },
            {
              label: (
                <div className={styles["tab-label"]}>
                  <UserOutlined />
                  <p>PROFILE</p>
                </div>
              ),
              key: "Profile",
              children: loginFromDb ? <Profile /> : null,
            },
            {
              label: (
                <div className={styles["tab-label"]}>
                  <UserOutlined />
                  <p>LIST</p>
                </div>
              ),
              key: "List",
              children: loginFromDb ? (
                <TableView allSweepstakes={tableData} loading={loading} />
              ) : null,
            },
          ]}
        />
      </div>
    </>
  );
};

export default CommercialPage;
