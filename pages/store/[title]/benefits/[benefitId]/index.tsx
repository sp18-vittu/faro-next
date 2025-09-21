import React, { useEffect, useState, useRef } from "react";
import { trackPageview, trackEvent } from "fathom-client";
import { Button, message, QRCode } from "antd";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import { i18n } from "next-i18next";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isBetween from "dayjs/plugin/isBetween";

import { useBenefitModalStore } from "@/state/BenefitModalStore";
import {
  JapaneseTemplateName,
} from "@/constant";
import { MusicBenefit } from "@/components/Benefits/BenefitModal/BenefitViewers/MusicBenefit";
import { VideoBenefit } from "@/components/Benefits/BenefitModal/BenefitViewers/VideoBenefit";
import { PDFBenefit } from "@/components/Benefits/BenefitModal/BenefitViewers/PDFBenefit";
import { MerchantDetails } from "@/components/Benefits/BenefitModal//BenefitViewers/MerchantDetails";
import SurveyBenefit from "@/components/Benefits/BenefitModal/BenefitViewers/SurveyBenefit";
import { useBenefitStore } from "@/state/BenefitState";
import { TagOutlined } from "@ant-design/icons";
import {
  BenefitType,
  BenefitLocale,
  RedeemStatus,
  RedeemData,
  Benefit,
  PassOwnedItems,
  DiscountType,
  Merchant,
  SweepstakeRegStatus,
  LoginMethod,
} from "@/shared/types/types";
import { getStoreFrontDetailsFromClient } from "@/utils/homePageApiUtils";
import Modal from "@/components/Modal";


import ClaimModal from "@/components/Claim/ClaimModal";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";
import env from "@/constant/env";
import styles from "./style.module.scss";
import {
  getPassOwnedItems,
  isCouponredeemable,
  redeemCoupon,
  CanRegisterForBenefit,
} from "@/utils/commonApiUtils";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { earnPointsFromRelation } from "@/utils/points";
import { usePassStore } from "@/state/PassState";
import { Footer } from "@/components/commons/Footer";
import { Header } from "@/components/commons/Header";
import { getStoreFrontDetails } from "@/utils/homePageApiUtils";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { InferGetStaticPropsType } from "next";
import {
  getBenefitDetailsUsingFetch,
  registerSweepstake,
} from "@/components/Benefits/apiUtils";
import { useWalletStore, WalletStoreState } from "@/state/WalletStore";

// const PDFViewer = dynamic<{}>(
//   (): any => import("../PDFComponents/PDFViewer").then((mod) => mod.PDFViewer),
//   {
//     ssr: false,
//   }
// );

type CustomDateFormatOptions = {
  year: "numeric";
  month: "long";
  day: "numeric";
  daySuffix?: "string";
  hour?: "2-digit";
  minute?: "2-digit";
};

export async function getServerSideProps({ req, res, query, locale }: any) {
  try {
    const title = query.title || env.DEFAULT_STORE;
    query.pointRewards = false;
    query.benefits = false;
    const apiResponse = await getStoreFrontDetails(req, res, title, query);
    if (!apiResponse.storefront.id) {
      return {
        redirect: {
          permanent: false,
          destination: "/404",
        },
      };
    }
    const benefitApiResponse = (await getBenefitDetailsUsingFetch(
      title,
      query.benefitId,
      query
    )) as { benefit: Benefit; merchant: Merchant };
    const url = req.headers.host;

    const localesData = await serverSideTranslations(locale, ["common"]);

    return {
      props: {
        ...localesData,
        localesData: localesData,
        storefront: apiResponse.storefront,
        currentBenefitDetail: benefitApiResponse.benefit,
        merchant: benefitApiResponse.merchant,
        url: url,
        tokenPassed: query.token ? true : false,
      },
    };
  } catch (err) {
    console.log("exception in benefit getServerResponse:", err);
    // return {
    //   redirect: {
    //     permanent: false,
    //     destination: "/404",
    //   },
    // };
  }
}

export default function BenefitsPage({
  storefront,
  currentBenefitDetail,
  merchant,
  url,
  tokenPassed,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  const [isClient, setIsClient] = useState(false);
  const { t } = useTranslation("common");
  const setStorefront = useStorefrontStore((state) => state.setStorefront);
  const isLoggedIn = useWalletStore(
    (state: WalletStoreState) => state.isLoggedIn
  );


  const { asPath } = useRouter();
  const currentLocaleId = useSelectedLocaleStore(
    (state) => state.currentLocaleId
  );
  const [currentLocale, setCurrentLocale] = useState<BenefitLocale | null>(
    null
  );

  // const currentBenefitDetail = useBenefitStore((state) => state.currentBenefit);
  const toggleModal = useBenefitModalStore((state) => state.setNotVisible);
  const isVisible = useBenefitModalStore((state) => state.visible);

  const passOwnedItems = usePassStore((state) => state.passOwnedItems);
  const passData = usePassStore((state) => state.passData);
  const setPassOwnedItems = usePassStore((state) => state.setPassOwnedItems);

  const setBenefits = useBenefitStore((state) => state.setBenefits);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenCong, setIsOpenCong] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);
  const [redeemStatus, setBenefitRedeemStatus] = useState<RedeemStatus | null>(
    null
  );
  const [userCanRegisterSweepstake, setCanRegisterSweepstake] =
    useState<boolean>(true);
  const [userSweepstakeRegData, setUserSweepstakeRegData] =
    useState<SweepstakeRegStatus | null>(null);
  const [redeemData, setRedeemData] = useState<RedeemData | null>(null);

  const [currentMerchant, setCurrentMerchant] = useState<Merchant | null>(null);

  const stateRef = useRef<{
    currentLocale: BenefitLocale | null;
    currentBenefit: Benefit | null;
    currentMerchant: Merchant | null;
  }>({
    currentLocale,
    currentBenefit: currentBenefitDetail,
    currentMerchant,
  });
  stateRef.current = {
    currentLocale,
    currentBenefit: currentBenefitDetail,
    currentMerchant,
  };

  useEffect(() => {
    if (currentBenefitDetail) {
      if (currentLocaleId && currentBenefitDetail) {
        const findLocale = currentBenefitDetail.locales.filter(
          (item) => item.localeId === currentLocaleId
        )[0];
        setCurrentLocale(findLocale);
        stateRef.current = {
          currentLocale: findLocale,
          currentBenefit: currentBenefitDetail,
          currentMerchant,
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBenefitDetail, currentLocaleId]);

  useEffect(() => {
    setStorefront(storefront);
    setIsClient(true);
   
    setCurrentMerchant(merchant);
    stateRef.current = {
      currentLocale,
      currentBenefit: currentBenefitDetail,
      currentMerchant,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBenefitDetail]);

  useEffect(() => {
    if (currentLocaleId) {
      stateRef.current = {
        currentLocale,
        currentBenefit: currentBenefitDetail,
        currentMerchant,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocaleId]);

  useEffect(() => {
    if (
      currentBenefitDetail &&
      currentBenefitDetail.type === BenefitType.DiscountBenefit &&
      currentMerchant?.selfRedeem
    ) {
      (async () => {
        const response = await isCouponredeemable({
          title: storefront?.title,
          data: {
            benefitId: currentBenefitDetail?.id,
          },
        });
        if (response.status === 200 || response.status === 422) {
          setBenefitRedeemStatus(response.data as RedeemStatus);
        }
      })();
    }
    if (
      currentBenefitDetail &&
      currentBenefitDetail.type === BenefitType.SweepstakesBenefit &&
      currentBenefitDetail?.sweepStake
    ) {
      (async () => {
        const response = await CanRegisterForBenefit({
          title: storefront?.title,
          data: {
            benefitId: currentBenefitDetail?.id,
          },
        });
        const sweepStakeReg = response.data as SweepstakeRegStatus;
        setUserSweepstakeRegData(sweepStakeReg);
        if (response.status === 200) {
          setCanRegisterSweepstake(response.data.canRegister);
        } else {
          if (response.data.message === "Please login to redeem coupon") {
            setCanRegisterSweepstake(true);
          } else setCanRegisterSweepstake(false);
        }
      })();
    }
    currentBenefitDetail &&
      trackPageview({
        url: `${storefront?.title}/benefit/${currentBenefitDetail?.id}`,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBenefitDetail, isOpen, isOpenCong]);

  const localeId =
    stateRef.current.currentBenefit &&
    stateRef.current.currentMerchant &&
    stateRef.current.currentMerchant.defaultLocaleId
      ? stateRef.current.currentMerchant.defaultLocaleId.replace("_", "-")
      : "en-US";

  const dateFormatOptions: CustomDateFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    daySuffix: "string",
    hour: "2-digit",
    minute: "2-digit",
  };

  const getDiscountString = (
    discountPrice: number,
    discountType: string,
    currencySymbol?: string
  ) => {
    if (discountType === "percentage") {
      return `${
        discountPrice < 100
          ? `${discountPrice}% ${t("DISCOUNT")} (${t("CONDITION_APPLY")})`
          : `${t("FREE")} (${t("CONDITION_APPLY")})`
      }`;
    } else {
      return `${currencySymbol ? currencySymbol : "$"}${discountPrice}`;
    }
  };

  const handleYesClick = async () => {
    setIsLoading(true);
    const response = await redeemCoupon({
      title: storefront?.title,
      data: {
        benefitId: stateRef.current.currentBenefit?.id,
      },
    });

    if (response.status !== 200) {
      message.open({
        type: "error",
        content: response.data.message,
      });
      setIsOpen(false);
      trackEvent("Self Redeem Yes Button", { _value: 50 });
    } else {
      setIsOpenCong(true);
      setIsOpen(false);
      setRedeemData(response.data);
    }
    setIsLoading(false);
  };

  const disclaimerMarkdown = `${
    stateRef.current.currentLocale?.disclaimer ||
    stateRef.current.currentBenefit?.disclaimer
  }`;

  const renderDiscountDetails = (currentBenefit: Benefit) => {
    return (
      currentBenefit?.type === BenefitType.DiscountBenefit && (
        <div className={`${styles.couponDetailsContainer} ${styles.nocursor}`}>
          <TagOutlined className={styles.discountIcon} />

          <div className={styles.couponDetails}>
            {currentBenefit.discountPrice && (
              <p suppressHydrationWarning className={styles.discount}>
                {t("SHOW_TO_USE")}
              </p>
            )}
            {currentBenefit.endDate && (
              <p suppressHydrationWarning className={styles.expiry}>
                {t("EXPIRY_DATE")}:{" "}
                {new Date(currentBenefit.endDate).toLocaleTimeString(
                  i18n?.language === "ja" ? "ja-JP" : localeId,
                  dateFormatOptions
                )}
              </p>
            )}
            {currentBenefit?.discountPrice &&
              redeemStatus &&
              redeemStatus.isRedeemable &&
              redeemStatus.details?.createdAt && (
                <span suppressHydrationWarning className={styles.expiry}>
                  {t("COUPON_USED")}
                  {new Date(
                    redeemStatus?.details?.createdAt
                  ).toLocaleTimeString(
                    i18n?.language === "ja" ? "ja-JP" : localeId,
                    dateFormatOptions
                  )}
                </span>
              )}
          </div>
        </div>
      )
    );
  };

  const renderPartnerRedirectCTA = (currentBenefit: Benefit) => {
    return (
      currentBenefit?.type === BenefitType.DiscountBenefit &&
      currentBenefit?.discountType === DiscountType.Partner && (
        <div
          className={`${styles.couponDetailsContainer} ${styles.nocursor}`}
          // onClick={() => setIsOpen(true)}
          // disabled={!redeemStatus?.isRedeemable}
        >
          <TagOutlined className={styles.discountIcon} />
          <div className={styles.couponDetails}>
            {dayjs().isBefore(dayjs(currentBenefit?.startDate)) && (
              <span suppressHydrationWarning className={styles.discount}>
                {t("OPENS_AT")}
                {": "}
                {currentBenefit?.startDate &&
                  new Date(currentBenefit.startDate).toLocaleTimeString(
                    i18n?.language === "ja" ? "ja-JP" : localeId,
                    dateFormatOptions
                  )}
              </span>
            )}
            {!dayjs().isBefore(dayjs(currentBenefit?.startDate)) && (
              <a
                href={currentBenefit?.partnerRedirectUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span suppressHydrationWarning className={styles.discount}>
                  {t("CLICK_TO_VISIT")}{" "}
                </span>
              </a>
            )}
          </div>
        </div>
      )
    );
  };

  const renderSelfRedeem = (currentBenefit: Benefit) => {
    let disableButton = false;

    const benefitInFuture =
      currentBenefit.startDate &&
      dayjs(currentBenefit.startDate).isAfter(dayjs());
    const benefitRedeemable = redeemStatus && redeemStatus.isRedeemable;
    //if benefit is already redeemed (not redeemable or start date is in future)
    if (!redeemStatus?.isRedeemable || benefitInFuture) disableButton = true;

    return (
      currentBenefit.type === BenefitType.DiscountBenefit && (
        <button
          className={styles.couponDetailsContainer}
          onClick={() => setIsOpen(true)}
          disabled={disableButton}
        >
          <TagOutlined className={styles.discountIcon} />
          <div className={styles.couponDetails}>
            {currentBenefit.startDate && benefitInFuture ? (
              <>
                <span suppressHydrationWarning className={styles.expiry}>
                  {t("AVAILABLE_FROM")}:{" "}
                  {new Date(currentBenefit.startDate).toLocaleTimeString(
                    i18n?.language === "ja" ? "ja-JP" : localeId,
                    dateFormatOptions
                  )}
                </span>
                <br />
              </>
            ) : (
              currentBenefit.discountPrice &&
              benefitRedeemable && (
                <>
                  <span suppressHydrationWarning className={styles.discount}>
                    {t("CLICK_TO_USE")}
                  </span>
                  {/* <br /> */}
                </>
              )
            )}
            {currentBenefit.endDate && benefitRedeemable && (
              <>
                <span suppressHydrationWarning className={styles.expiry}>
                  {t("EXPIRY_DATE")}:{" "}
                  {new Date(currentBenefit.endDate).toLocaleTimeString(
                    i18n?.language === "ja" ? "ja-JP" : localeId,
                    dateFormatOptions
                  )}
                </span>
                <br />
              </>
            )}
            {!benefitRedeemable && redeemStatus?.details?.createdAt && (
              <>
                <span suppressHydrationWarning className={styles.expiry}>
                  {t("YOU_HAVE_USED")}
                  {": "}
                  {new Date(
                    redeemStatus?.details?.createdAt
                  ).toLocaleTimeString(
                    i18n?.language === "ja" ? "ja-JP" : localeId,
                    dateFormatOptions
                  )}
                </span>
              </>
            )}
            {currentBenefit.discountPrice &&
              currentBenefit?.endDate &&
              !benefitInFuture &&
              !benefitRedeemable &&
              redeemStatus?.error?.message.startsWith("Please login") && (
                <>
                  <span className={styles.discount}>{t("LOGIN_TO_USE")} </span>
                  <span suppressHydrationWarning className={styles.expiry}>
                    {t("EXPIRY_DATE")}:{" "}
                    {new Date(currentBenefit.endDate).toLocaleTimeString(
                      i18n?.language === "ja" ? "ja-JP" : localeId,
                      dateFormatOptions
                    )}
                  </span>
                </>
              )}
            {currentBenefit.discountPrice &&
              !benefitInFuture &&
              !benefitRedeemable &&
              !redeemStatus?.error?.message.startsWith("Please login") && (
                <span className={styles.discount}>
                  {t("NO_LONGER_AVAILABLE")}{" "}
                </span>
              )}
          </div>
        </button>
      )
    );
  };

  dayjs.extend(isSameOrBefore);
  dayjs.extend(isBetween);
  const renderRegisterButton = (currentBenefit: Benefit) => {
    return (
      <>
        <div className={styles.registerContainer}>
          <button
            disabled={!userCanRegisterSweepstake}
            onClick={() => handleSweepStakeRegisterClick()}
            className={`${styles.registerButtonContainer} ${
              userCanRegisterSweepstake
                ? ""
                : styles.registerButtonContainerDisabled
            }`}
          >
            {dayjs().isBefore(dayjs(currentBenefit?.startDate)) && (
              <span className={styles.discount}>
                {t("OPENS_AT")}
                {": "}
                {currentBenefit?.startDate &&
                  new Date(currentBenefit.startDate).toLocaleTimeString(
                    i18n?.language === "ja" ? "ja-JP" : localeId,
                    dateFormatOptions
                  )}
              </span>
            )}
            {dayjs().isBetween(
              dayjs(currentBenefit?.startDate),
              dayjs(currentBenefit?.endDate),
              "minute",
              "[]"
            ) && (
              <span>
                {userCanRegisterSweepstake
                  ? t("REGISTER")
                  : !isLoggedIn 
                  ? t("LOGIN_TO_USE")
                  : t("REGISTERED")}
              </span>
            )}
            {dayjs().isAfter(dayjs(currentBenefit?.endDate)) && (
              <span>
                {!userCanRegisterSweepstake &&
                userSweepstakeRegData?.registration
                  ? userSweepstakeRegData?.registration?.isWinner
                    ? t("WINNER")
                    : t("REGISTERED")
                  : t("ENDED")}
                {!userCanRegisterSweepstake &&
                  userSweepstakeRegData?.registration?.isWinner &&
                  currentBenefit.sweepStake?.isFastPass && (
                    <>
                      <QRCode
                        className={styles["qrCode"]}
                        value={`FastPass ${
                          userSweepstakeRegData?.registration?.winnerPosition ||
                          userSweepstakeRegData?.registration?.sequenceNumber ||
                          "-"
                        } for ${currentBenefit?.title}`}
                      />
                      <p>{`FastPass ${
                        userSweepstakeRegData?.registration?.winnerPosition ||
                        userSweepstakeRegData?.registration?.sequenceNumber ||
                        "-"
                      } for ${currentBenefit?.title}`}</p>
                    </>
                  )}
              </span>
            )}
          </button>
        </div>
      </>
    );
  };

  const handleSweepStakeRegisterClick = async () => {
    setIsLoading(true);
    const response = await registerSweepstake({
      storefrontTitle: storefront?.title,
      benefitId: stateRef.current.currentBenefit?.id,
    });

    if (response.status !== 200) {
      message.open({
        type: "error",
        content: response.data.message,
      });
    } else {
      setCanRegisterSweepstake(false);
    }
    setIsLoading(false);
  };

  return (
    <div id="landingPage">
      <Head>
        <title>
          {storefront?.title}-
          {stateRef.current.currentLocale?.title ||
            stateRef.current.currentBenefit?.title}
          `
        </title>
        <meta
          name="description"
          content={`${
            stateRef.current.currentLocale?.description ||
            stateRef.current.currentBenefit?.description
          }`}
        />
        <meta property="og:title" content={storefront?.heroHeadline} />
        <meta
          property="og:description"
          content={
            storefront?.heroDesc || `${storefront?.heroHeadline} description`
          }
        />
        <meta
          property="og:image"
          content={
            stateRef.current.currentLocale?.previewResourceUrl ||
            stateRef.current.currentBenefit?.previewResourceUrl ||
            stateRef.current.currentMerchant?.heroImageUrl
          }
        />
        <meta property="og:url" content={`https://${url}${asPath}`} />
        <meta property="og:type" content="website" />
      </Head>

      {!tokenPassed && <Header template={storefront?.themeId} />}
      <ClaimModal template={storefront?.themeId} parentId="landingPage" />

      {isClient && stateRef.current.currentBenefit ? (
        <div
          className={`${styles["benefit-modal"]} ${
            storefront?.themeId === JapaneseTemplateName
              ? styles["anime-benefit-modal"]
              : ""
          }`}
        >
          <div className={styles["benefit-wrapper"]}>
            {(stateRef.current.currentBenefit.type ===
              BenefitType.DiscountBenefit ||
              stateRef.current.currentBenefit.type ===
                BenefitType.SweepstakesBenefit) && (
              <div className={styles["benefit-image"]}>
                <Image
                  className={styles.mainImage}
                  fill={true}
                  src={
                    stateRef.current.currentLocale?.previewResourceUrl ||
                    stateRef.current.currentBenefit?.previewResourceUrl ||
                    stateRef.current.currentMerchant?.heroImageUrl ||
                    "/images/logo.png"
                  }
                  alt="benefit image"
                />
              </div>
            )}
            <div
              className={`${styles["benefit-content"]} ${
                storefront.themeId === JapaneseTemplateName
                  ? styles["anime-benefit-content"]
                  : ""
              }`}
            >
              <h2>
                {stateRef.current.currentLocale?.title ||
                  stateRef.current.currentBenefit.title}
              </h2>
              <ReactMarkdown className={styles.description}>
                {stateRef.current.currentLocale?.description ||
                  stateRef.current.currentBenefit.description}
              </ReactMarkdown>

              {/*following if condition is super tricky
                we show button only if user is logged in if membership required
                or membership is not required */}
              {stateRef.current.currentBenefit.type ===
                BenefitType.DiscountBenefit &&
                ((stateRef.current.currentBenefit.membershipRequired &&
                  (isLoggedIn)) ||
                  !stateRef.current.currentBenefit.membershipRequired) &&
                stateRef.current.currentMerchant?.selfRedeem &&
                stateRef.current.currentBenefit?.discountType !==
                  DiscountType.Partner &&
                renderSelfRedeem(stateRef.current.currentBenefit)}

              {stateRef.current.currentBenefit.type ===
                BenefitType.DiscountBenefit &&
                ((stateRef.current.currentBenefit.membershipRequired &&
                  (isLoggedIn)) ||
                  !stateRef.current.currentBenefit.membershipRequired) &&
                !stateRef.current.currentMerchant?.selfRedeem &&
                stateRef.current.currentBenefit?.discountType !==
                  DiscountType.Partner &&
                renderDiscountDetails(stateRef.current.currentBenefit)}

              {stateRef.current.currentBenefit.type ===
                BenefitType.DiscountBenefit &&
                ((stateRef.current.currentBenefit.membershipRequired &&
                  (isLoggedIn)) ||
                  !stateRef.current.currentBenefit.membershipRequired) &&
                stateRef.current.currentBenefit?.discountType ===
                  DiscountType.Partner &&
                renderPartnerRedirectCTA(stateRef.current.currentBenefit)}
              {/* We need to render NFT register/claim button for sweepstakes or 
                benefit is attached to NFT and its hidecard = true */}

              {stateRef.current.currentBenefit.type ===
                BenefitType.SweepstakesBenefit &&
                stateRef.current.currentBenefit.sweepStake &&
                renderRegisterButton(stateRef.current.currentBenefit)}
              {stateRef.current.currentBenefit &&
                (() => {
                  switch (stateRef.current.currentBenefit.type) {
                    case BenefitType.AudioBenefit:
                      return (
                        <MusicBenefit
                          benefit={stateRef.current.currentBenefit}
                        />
                      );
                    case BenefitType.VideoBenefit:
                      return (
                        <VideoBenefit
                          benefit={stateRef.current.currentBenefit}
                        />
                      );
                    case BenefitType.StreamingBenefit:
                      return (
                        <VideoBenefit
                          benefit={stateRef.current.currentBenefit}
                        />
                      );
                    case BenefitType.PDFBenefit:
                      // return <PDFBenefit benefit={currentBenefit} />;
                      return (
                        <PDFBenefit benefit={stateRef.current.currentBenefit} />
                      );
                    case BenefitType.SurveyBenefit:
                      return (
                        <SurveyBenefit
                          benefit={stateRef.current.currentBenefit}
                        />
                      );
                    default:
                      return <></>;
                  }
                })()}
            </div>

            {(stateRef.current.currentBenefit?.type ===
              BenefitType.DiscountBenefit ||
              stateRef.current.currentBenefit?.type ===
                BenefitType.SweepstakesBenefit) && (
              <>
                <div className={styles.disclaimerContainer}>
                  <ReactMarkdown>{disclaimerMarkdown}</ReactMarkdown>
                </div>
                {stateRef.current.currentMerchant && (
                  <MerchantDetails
                    merchant={stateRef.current.currentMerchant}
                    template={storefront?.themeId}
                  />
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        "No Data"
      )}

      <Modal
        isOpen={isOpen}
        centered
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        footer={[
          <Button
            key="no"
            onClick={() => {
              trackEvent("Self Redeem No Button", { _value: 1 });
              setIsOpen(false);
            }}
          >
            {t("NO")}
          </Button>,
          <Button
            type="primary"
            key="no"
            onClick={handleYesClick}
            loading={isLoading}
          >
            {t("YES")}
          </Button>,
        ]}
      >
        <p className={styles["confirmation-text"]}>
          {t("BENEFIT_CONFIRMATION")}
          <br />
          {t("BEFORE_CLICK")}
        </p>
      </Modal>

      <Modal isOpen={isOpenCong} centered onCancel={() => setIsOpenCong(false)}>
        <p className={styles["confirmation-text"]}>
          {t("CONGRATS")}
          <br />
          {t("SHOW_MESSAGE")}
          <br />
          <br />

          <span>
            {t("CONFIRMATION_CODE")}: {redeemData?.transactionId}
          </span>
          <br />
          <QRCode
            className={styles["qrCode"]}
            value={redeemData?.transactionId || "-"}
          />
        </p>
      </Modal>
      {!tokenPassed && <Footer template={storefront?.themeId} />}
    </div>
  );
}
