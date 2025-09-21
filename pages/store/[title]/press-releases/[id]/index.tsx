import { useEffect, useState } from "react";
import { Button, Col, Row, Tabs, Image as AntdImage } from "antd";
import dynamic from "next/dynamic";
import { InferGetStaticPropsType } from "next";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  CaretUpOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import { Header } from "@/components/commons/Header";
import { getPressRelease } from "@/utils/pressReleasesApiUtils";
import { getStoreFrontDetails } from "@/utils/homePageApiUtils";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { useThemeStore } from "@/state/ThemeDetailsStore";

import { Footer } from "@/components/commons/Footer";

import styles from "./pressReleaseDetail.module.scss";

const ClaimModal = dynamic(() => import("@/components/Claim/ClaimModal"));

export async function getServerSideProps({ req, res, query, locale }: any) {
  const title = query.title;
  const id = query.id;
  try {
    const [apiResponse, storefrontApiResponse] = await Promise.all([
      getPressRelease(title, id),
      getStoreFrontDetails(req, res, title, query),
    ]);
    // const apiResponse = await getPressRelease(title, id);
    const localesData = await serverSideTranslations(locale, ["common"]);
    return {
      props: {
        ...localesData,
        data: apiResponse.data,
        title: title,
        themeDetails: storefrontApiResponse.themeDetails,
        storefront: storefrontApiResponse.storefront,
      },
    };
  } catch (err: any) {
    console.error(`Error fetching data for press release, id: ${id}`, err);
    return {
      notFound: true,
      // redirect: {
      //   permanent: false,
      //   destination: "/404",
      // },
    };
  }
}

const PressRelease = ({
  data,
  title,
  storefront,
  themeDetails,
}: InferGetStaticPropsType<typeof getServerSideProps>) => {
  const { heading, description, heroImage, startDate, imageUrls, contactInfo } =
    data;
  const setStorefront = useStorefrontStore((state) => state.setStorefront);
  const setThemeDetails = useThemeStore((state) => state.setThemeDetails);
  const [previewIndex, setPreviewIndex] = useState<number>();

  const { t } = useTranslation("common");

  useEffect(() => {
    setStorefront(storefront);
    setThemeDetails(themeDetails);
  }, []);

  return (
    <>
      <Header template="Commercial" isPressReleaseDetail />
      <div id="press-release" className="container">
        <ClaimModal parentId="press-release" />
        <div className={styles.wrapper}>
          <h1 className={styles.heading}>{heading}</h1>
          <Tabs
            items={[
              {
                key: "releases",
                label: t("RELEASE"),
                children: (
                  <>
                    <Image
                      height={640}
                      width={930}
                      src={heroImage}
                      className={styles.heroImage}
                      alt="Hero-Image"
                    />
                    <p className={styles["time"]}>
                      <ClockCircleOutlined />
                      {dayjs(startDate).format("MMM DD, YYYY")}
                    </p>
                    <ReactMarkdown
                      className={styles.markdown}
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {props.children}
                          </a>
                        ),
                      }}
                    >
                      {description}
                    </ReactMarkdown>
                    {contactInfo && (
                      <>
                        <div className={styles.divider}>###</div>
                        <ReactMarkdown
                          className={styles.markdown}
                          components={{
                            a: ({ node, ...props }) => (
                              <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {props.children}
                              </a>
                            ),
                          }}
                        >
                          {contactInfo}
                        </ReactMarkdown>
                      </>
                    )}
                  </>
                ),
              },
              {
                key: "photos",
                label: t("PHOTOS"),
                children: (
                  <>
                    {/* <Flex justify="center">
                      <Button
                        className={styles["download-all"]}
                        icon={<DownloadOutlined />}
                      >
                        Download All Photos
                      </Button>
                    </Flex> */}
                    <AntdImage.PreviewGroup
                      items={[heroImage, ...imageUrls]}
                      preview={{
                        onChange: (current, prev) => {
                          setPreviewIndex(current);
                        },
                        visible: previewIndex !== undefined,
                        onVisibleChange: () => setPreviewIndex(undefined),
                        current: previewIndex ?? 0,
                      }}
                    />
                    <Row gutter={[30, 20]}>
                      {[heroImage, ...imageUrls].map((el: string, index) => (
                        <Col md={8}>
                          <Image
                            src={el}
                            height={196}
                            width={295}
                            className={styles.photos}
                            alt="Photos"
                            onClick={() => setPreviewIndex(index)}
                          />
                        </Col>
                      ))}
                    </Row>
                  </>
                ),
              },
            ]}
          />

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
          </div>
        </div>
      </div>
      <Footer template="Commercial" />
    </>
  );
};

export default PressRelease;
