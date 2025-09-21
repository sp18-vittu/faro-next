import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { message, Button } from "antd";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { InferGetStaticPropsType } from "next";
import env from "@/constant/env";

import { Header } from "@/components/commons/Header";
import { Footer } from "@/components/commons/Footer";
import { getAllPressReleases } from "@/utils/pressReleasesApiUtils";
import { getStoreFrontDetails } from "@/utils/homePageApiUtils";
import { useStorefrontStore } from "@/state/StorefrontStore";

import styles from "./pressReleases.module.scss";
import { useThemeStore } from "@/state/ThemeDetailsStore";

const ClaimModal = dynamic(() => import("@/components/Claim/ClaimModal"));

export async function getServerSideProps({ req, res, query, locale }: any) {
  const page = query.page || 1;
  const title = query.title || env.DEFAULT_STORE;
  try {
    const [apiResponse, storefrontApiResponse] = await Promise.all([
      getAllPressReleases(title, page),
      getStoreFrontDetails(req, res, title, query),
    ]);
    const localesData = await serverSideTranslations(locale, ["common"]);
    const { data, totalCount } = apiResponse.data;
    return {
      props: {
        ...localesData,
        initialItems: data,
        title,
        totalCount: totalCount,
        themeDetails: storefrontApiResponse.themeDetails,
        storefront: storefrontApiResponse.storefront,
      },
    };
  } catch (err: any) {
    console.error("Error fetching data for press releases:", err);
    return {
      notFound: true,
      // redirect: {
      //   permanent: false,
      //   destination: "/404",
      // },
    };
  }
}

export default function PressReleases({
  initialItems,
  title,
  totalCount,
  themeDetails,
  storefront,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  const [items, setItems] = useState(initialItems);
  const [loadingItems, setLoadingItems] = useState(false);
  const [page, setPage] = useState(1);

  const setStorefront = useStorefrontStore((state) => state.setStorefront);
  const setThemeDetails = useThemeStore((state) => state.setThemeDetails);
  const router = useRouter();

  const { t } = useTranslation("common");

  const handleLoadNext = async () => {
    try {
      setLoadingItems(true);
      const apiResponse = await getAllPressReleases(title, page + 1);
      if (apiResponse.data.data.length > 0) {
        setItems((prev: any) => [...prev, ...apiResponse.data.data]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      message.error({
        content: "Something went wrong",
        duration: 3,
        key: "pr-fetch-error",
      });
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    setStorefront(storefront);
    setThemeDetails(themeDetails);
  }, []);

  return (
    <>
      <Header template="Commercial" isPressRelease />
      <div className="container" id="Press-Release-Page">
        <ClaimModal template="Commercial" parentId="Press-Release-Page" />
        <h1 className={styles["pr"]}>{t("PRESS_RELEASES")}</h1>
        <div>
          {items.map((item: any) => (
            <div className={styles["card-wrapper"]} key={item.id}>
              <div className={styles["image-cont"]}>
                <Image
                  src={item.heroImage}
                  alt={`pr-${item.id}`}
                  width={262}
                  height={160}
                  onClick={() => {
                    router.push(`/store/${title}/press-releases/${item.id}`);
                  }}
                />
              </div>
              <div className={styles["details-cont"]}>
                <p
                  className={styles.heading}
                  onClick={() => {
                    router.push(`/store/${title}/press-releases/${item.id}`);
                  }}
                >
                  {item.heading}
                </p>
                <p className={styles["time"]}>
                  <ClockCircleOutlined />
                  {dayjs(item.startDate).format("MMM DD, YYYY")}
                </p>
                <ReactMarkdown className={styles.desc}>
                  {item.description}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {items.length > 0 && (
            <div className={styles["action-btn-cont"]}>
              <Button
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                icon={<CaretUpOutlined />}
              >
                {t("BACK_TO_TOP")}
              </Button>
              {!(items?.length === totalCount) && (
                <Button
                  onClick={() => {
                    handleLoadNext();
                  }}
                  icon={<CaretDownOutlined />}
                  loading={loadingItems}
                  disabled={loadingItems}
                >
                  {t("LOAD_MORE")}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer template="Commercial" />
    </>
  );
}
