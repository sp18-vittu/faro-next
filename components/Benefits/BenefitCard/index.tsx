import React, { useEffect, useState, useRef } from "react";
import { Card, message } from "antd";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import {
  LockOutlined,
  StarOutlined,
  UnlockOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { shallow } from "zustand/shallow";
import Image from "next/image";
import dayjs from "dayjs";
import { trackEvent } from "fathom-client";

import test from "../../../public/test.png";
import Music from "../../../public/icons/Music.svg";
import Video from "../../../public/icons/Video.svg";
import PDF from "../../../public/icons/PDF.svg";
import All from "../../../public/images/all.svg";
import Gold from "../../../public/images/gold.svg";
import Bronze from "../../../public/images/bronze.svg";
import Silver from "../../../public/images/silver.svg";
import Discount from "../../../public/icons/Discount.svg";

import { useBenefitModalStore } from "@/state/BenefitModalStore";
import { useBenefitStore } from "@/state/BenefitState";
import { usePassStore } from "@/state/PassState";
import {
  Benefit,
  BenefitLocale,
  BenefitType,
  LoginMethod,
  Merchant,
  PassData,
} from "@/shared/types/types";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";
import { WalletStoreState, useWalletStore } from "@/state/WalletStore";
import { getPass } from "@/components/Claim/ClaimModal/apiUtils";
import { redeemBenefit } from "@/utils/commonApiUtils";
import { getStoreFrontDetailsFromClient } from "@/utils/homePageApiUtils";
import { JapaneseTemplateName } from "@/constant";
import { getBenefitDetails } from "@/components/Benefits/apiUtils";

import styles from "./style.module.scss";
import CommercialCard from "@/components/Commercial/CommercialCard/CommercalCard";

interface BenefitCardProps {
  benefit: Benefit;
  id: number;
  border?: boolean;
  size?: string;
  className?: string;
  imageClass?: string;
  web3Benefit?: boolean;
  ownWeb3?: boolean;
  currentPointsTotal?: number;
  template?: string;
  templateDefault?: string;
  isSlider?: boolean;
  isFullWidth?: boolean;
}

const BenefitTypeView = ({
  benefit,
  benefitText,
  template,
}: {
  benefit: Benefit;
  benefitText: string;
  template?: string;
}) => {
  return (
    <div
      className={`${styles.benefitType}${
        template === JapaneseTemplateName ? ` ${styles["anime-type"]}` : ""
      }`}
    >
      <span className={styles.benefitSpan}>{benefitText}</span>
      {benefit &&
        (() => {
          switch (benefit.type) {
            case BenefitType.DiscountBenefit:
              return (
                <Image
                  className={styles.icon}
                  src={Discount}
                  alt="logo"
                  fill={false}
                />
              );
            case BenefitType.AudioBenefit:
              return (
                <Image
                  className={styles.icon}
                  src={Music}
                  alt="logo"
                  fill={false}
                />
              );
            case BenefitType.VideoBenefit:
              return (
                <Image
                  className={styles.icon}
                  src={Video}
                  alt="logo"
                  fill={false}
                />
              );
            case BenefitType.StreamingBenefit:
              return (
                <Image
                  className={styles.icon}
                  src={Video}
                  alt="logo"
                  fill={false}
                />
              );
            case BenefitType.PDFBenefit:
              return (
                <Image
                  className={styles.icon}
                  src={PDF}
                  alt="logo"
                  fill={false}
                />
              );
          }
        })()}
    </div>
  );
};

const checkBenefitOwnership = (benefit: Benefit) => {
  if (benefit) {
    if (benefit.type === BenefitType.DiscountBenefit) {
      return benefit.couponCode !== "" ? true : false;
    } else {
      let owned = true;
      benefit.BenefitResource.forEach((resource) => {
        if (resource.resourceUrl === "") {
          owned = false;
        }
      });
      return owned;
    }
  }
  return false;
};

const EarnView = ({
  earnPoints,
  template,
}: {
  earnPoints: number;
  template?: string;
}) => {
  return (
    <div
      className={`${styles.benefitType}${
        template === JapaneseTemplateName ? ` ${styles["anime-type"]}` : ""
      }`}
      style={{ marginTop: "5px" }}
    >
      <span className={styles.benefitSpan}>Earn {earnPoints} pts &nbsp;</span>
      <StarOutlined
        style={{ color: "white" }}
        className={styles.icon}
        alt="earn"
      />
    </div>
  );
};
export const BenefitCard = (props: BenefitCardProps) => {
  const {
    benefit,
    id,
    border = true,
    size = "lg",
    className,
    imageClass,
    web3Benefit = false,
    ownWeb3 = false,
    template,
    isSlider,
    isFullWidth,
  } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation("common");

  const isLoggedIn = useWalletStore(
    (state: WalletStoreState) => state.isLoggedIn
  );

  const passData = usePassStore((state) => state.passData, shallow);
  const currentLocaleId = useSelectedLocaleStore(
    (state) => state.currentLocaleId
  );
  const [currentLocale, setCurrentLocale] = useState<BenefitLocale | null>(
    null
  );
  const toggleBenefitModal = useBenefitModalStore((state) => state.setVisible);
  const setCurrentBenefit = useBenefitStore((state) => state.setCurrentBenefit);
  const programDetails = useBenefitStore((state) => state.programDetails);
  const storefront = useStorefrontStore((state) => state.storefront);
  const setStorefront = useStorefrontStore((state) => state.setStorefront);
  const setBenefits = useBenefitStore((state) => state.setBenefits);
  const setPassData = usePassStore((state) => state.setPassData);
  const setPointsTotal = usePassStore((state) => state.setPointsTotal);
  const pointsTotal = usePassStore((state) => state.pointsTotal, shallow);
  const [currentMerchant, setCurrentMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    const curMerchant =
      (benefit?.merchantId &&
        storefront?.merchants.find(
          (item: Merchant) => item.id === benefit?.merchantId
        )) ||
      null;
    setCurrentMerchant(curMerchant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefit]);

  const stateRef = useRef<{
    pointsTotal: number;
    isLoggedIn: boolean;
    passData: PassData | null;
    currentMerchant: Merchant | null;
  }>({
    pointsTotal,
    isLoggedIn,
    passData,
    currentMerchant,
  });

  stateRef.current = {
    pointsTotal,
    isLoggedIn,
    passData,
    currentMerchant,
  };

  const style = {
    border: border === false ? "transparent" : "",
  };

  const classNameCard =
    size === "lg" ? `${styles.card}` : `${styles.smallCard}`;

  useEffect(() => {
    // we check the points total in callback
    // callback takes the value at the time of setup
    // we have to use useRef and constantly update the value in ref
    // so callback has latest value
    stateRef.current = {
      pointsTotal,
      isLoggedIn,
      passData,
      currentMerchant,
    };
  }, [pointsTotal, isLoggedIn, passData]);

  const earnPoints = passData
    ? benefit?.pointRelations
        ?.filter((r) => !r.tierId || r.tierId == passData.tierId)
        .reduce(
          (total, pointRelation) =>
            total + pointRelation.pointsReward.pointReward,
          0
        )
    : benefit?.pointRelations
        ?.filter((r) => !r.tierId || r.tierId == programDetails?.lowestTier?.id)
        .reduce(
          (total, pointRelation) =>
            total + pointRelation.pointsReward.pointReward,
          0
        );

  const handleOnClick = React.useCallback(async () => {
    try {
      trackEvent("Benefit Card Clicked", { _value: 1 });
      let benefitFromDb: Benefit = benefit;
      const response: any = await getBenefitDetails(
        storefront?.title,
        benefit.id
      );
      if (response.status === 200) {
        benefitFromDb = response.data.benefit as Benefit;
      }
      if (
        benefitFromDb.membershipCriteria === "NotRequired" ||
        storefront?.membershipCriteria === "NotRequired"
      ) {
        setCurrentBenefit(benefitFromDb);
        toggleBenefitModal();
        return;
      }
      if (
        (!web3Benefit &&
          ((storefront?.loginMethod !== LoginMethod.DEFAULT &&
            stateRef.current.isLoggedIn ) ||
            (storefront?.loginMethod === LoginMethod.DEFAULT &&
              stateRef.current.isLoggedIn))) ||
        (web3Benefit && ownWeb3)
      ) {
        if (
          (benefit.pointPrice && checkBenefitOwnership(benefit)) ||
          !benefit.pointPrice ||
          web3Benefit
        ) {
          setCurrentBenefit(benefitFromDb);
          toggleBenefitModal();
        } else if (benefit.pointPrice && !checkBenefitOwnership(benefit)) {
          if (stateRef.current.pointsTotal >= benefit.pointPrice) {
            const response = await redeemBenefit(
              stateRef.current.passData?.passId,
              benefit.id
            );
            if (response.status == 200) {
              const {
                benefits,
                storefront: newStorefront,
                program,
              } = await getStoreFrontDetailsFromClient(storefront?.title);
              setStorefront(newStorefront);
              setBenefits(benefits);
              const response = await getPass(storefront?.title);
              if (response.status === 200) {
                setPassData(response.data as PassData);
                setPointsTotal((response.data as PassData).pointsTotal);
              }
            } else {
              messageApi.open({
                type: "error",
                content: response?.data?.message,
                duration: 3,
              });
            }
          } else {
            messageApi.open({
              type: "error",
              content: t("NOT_ENOUGH_POINTS"),
              duration: 3,
            });
          }
        }
      } 
    } catch (err) {
      console.log("benefit card err:", err);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefit, setCurrentBenefit, toggleBenefitModal, ownWeb3]);

  const benefitText = React.useMemo(() => {
    switch (benefit?.type) {
      case BenefitType.DiscountBenefit:
        return t("COUPON");
      case BenefitType.AudioBenefit:
        return t("AUDIO");
      case BenefitType.VideoBenefit:
        return t("VIDEO");
      case BenefitType.StreamingBenefit:
        return t("VIDEO");
      case BenefitType.PDFBenefit:
        return t("PDF");
      case BenefitType.SweepstakesBenefit:
        return t("SEEMORE");
      default:
        return t("BENEFIT");
    }
  }, [benefit?.type, t]);

  useEffect(() => {
    if (currentLocaleId && benefit) {
      const findLocale = benefit.locales.filter(
        (item) => item.localeId === currentLocaleId
      )[0];
      setCurrentLocale(findLocale);
    }
  }, [currentLocaleId, benefit]);

  const tierBiscuit = (tierName: string) => {
    switch (tierName) {
      case "Gold":
        return <Image src={Gold} fill alt="" />;
      case "Bronze":
        return <Image src={Bronze} fill alt="" />;
      case "Silver":
        return <Image src={Silver} fill alt="" />;
      default:
        return <Image src={All} fill alt="" />;
    }
  };

  const renderImageOnlyCard = () => (
    <div
      className={`${styles["image-only-wrapper"]} ${
        template === JapaneseTemplateName && isSlider
          ? styles["anime-image-only-wrapper"]
          : ""
      }`}
    >
      <Image
        className={`${styles.image} ${
          template === JapaneseTemplateName ? styles["anime-image"] : ""
        }`}
        fill={true}
        src={
          currentLocale?.previewResourceUrl ||
          benefit?.previewResourceUrl ||
          currentMerchant?.heroImageUrl ||
          test
        }
        alt="test"
        onClick={handleOnClick}
      />
    </div>
  );

  const renderRegularDefaultThemeCard = () => (
    <Card
      hoverable
      className={`${classNameCard}${className ? ` ${className}` : ""}`}
      style={style}
      onClick={handleOnClick}
      data-points-total={pointsTotal}
    >
      <div
        className={`${styles.imageContainer}${
          imageClass ? ` ${imageClass}` : ""
        }`}
      >
        {benefit.pointPrice &&
          !checkBenefitOwnership(benefit) &&
          size === "sm" &&
          template !== JapaneseTemplateName && (
            <div className={styles.redeemsmall}>
              <PaperClipOutlined className={styles.buy} /> {t("REDEEM")}
            </div>
          )}
        {benefit.pointPrice &&
          !checkBenefitOwnership(benefit) &&
          size !== "sm" &&
          template !== JapaneseTemplateName && (
            <div className={styles.redeem}>
              <PaperClipOutlined className={styles.buy} /> {t("REDEEM")}
            </div>
          )}
        <Image
          className={`${styles.image} ${
            template === JapaneseTemplateName ? styles["anime-image"] : ""
          }`}
          fill={true}
          src={
            currentLocale?.previewResourceUrl ||
            benefit?.previewResourceUrl ||
            currentMerchant?.heroImageUrl ||
            test
          }
          alt="test"
        />
        {size === "sm" && (
          <div className={styles["benefit-chips"]}>
            <BenefitTypeView
              benefit={benefit}
              benefitText={benefitText}
              template={template}
            />
            {earnPoints > 0 && (
              <EarnView earnPoints={earnPoints} template={template} />
            )}
          </div>
        )}
      </div>
      <div className={styles["card-title"]}>
        <div className={styles.title}>
          {currentLocale?.title || benefit?.title}
        </div>
        {size !== "sm" && (
          <div className={styles["benefit-chips"]}>
            <BenefitTypeView
              benefit={benefit}
              benefitText={benefitText}
              template={template}
            />
            {earnPoints > 0 && (
              <EarnView earnPoints={earnPoints} template={template} />
            )}
          </div>
        )}
      </div>
      <ReactMarkdown className={styles.content}>
        {currentLocale?.description || benefit?.description}
      </ReactMarkdown>
    </Card>
  );

  const renderRegularAnimeThemeCard = () => (
    <Card
      hoverable
      className={`${classNameCard}${className ? className : ""} ${
        styles["jap-card-wrapper"]
      } 
      ${isSlider ? styles["anime-slider-wrapper"] : ""}`}
      style={style}
      onClick={handleOnClick}
      data-points-total={pointsTotal}
    >
      <>
        {currentMerchant && (
          <div className={styles["store-name"]}>
            <p>
              {currentMerchant?.locales?.find(
                (item) => item.localeId === currentLocaleId
              )?.name || currentMerchant?.name}
            </p>
          </div>
        )}
        <div
          className={`${styles.imageContainer}${
            imageClass ? ` ${imageClass}` : ""
          }`}
        >
          {benefit.pointPrice &&
            !checkBenefitOwnership(benefit) &&
            size === "sm" &&
            template !== JapaneseTemplateName && (
              <div className={styles.redeemsmall}>
                <PaperClipOutlined className={styles.buy} /> {t("REDEEM")}
              </div>
            )}
          {benefit.pointPrice &&
            !checkBenefitOwnership(benefit) &&
            size !== "sm" &&
            template !== JapaneseTemplateName && (
              <div className={styles.redeem}>
                <PaperClipOutlined className={styles.buy} /> {t("REDEEM")}
              </div>
            )}
          <Image
            className={`${styles.image} ${styles["anime-image"]}`}
            fill={true}
            src={
              currentLocale?.previewResourceUrl ||
              benefit?.previewResourceUrl ||
              currentMerchant?.heroImageUrl ||
              test
            }
            alt="test"
          />
          {!isSlider && size === "sm" && (
            <div className={styles["benefit-chips"]}>
              <BenefitTypeView
                benefit={benefit}
                benefitText={benefitText}
                template={template}
              />
              {earnPoints > 0 && (
                <EarnView earnPoints={earnPoints} template={template} />
              )}
            </div>
          )}
        </div>
        {benefit.pointPrice && checkBenefitOwnership(benefit) && (
          <div className={`${styles.points} ${styles["anime-points"]}`}>
            <UnlockOutlined className={styles.lock} /> {benefit.pointPrice}{" "}
            <span>PTS</span>
          </div>
        )}
        {benefit.pointPrice && !checkBenefitOwnership(benefit) && (
          <div className={`${styles.points} ${styles["anime-points"]}`}>
            <LockOutlined className={styles.lock} /> {benefit.pointPrice}{" "}
            <span>PTS</span>
          </div>
        )}
        <div className={styles["card-title"]}>
          <div className={styles.title}>
            {currentLocale?.title || benefit?.title}
          </div>
          {size !== "sm" && (
            <div className={styles["benefit-chips"]}>
              <BenefitTypeView
                benefit={benefit}
                benefitText={benefitText}
                template={template}
              />
              {earnPoints > 0 && (
                <EarnView earnPoints={earnPoints} template={template} />
              )}
            </div>
          )}
        </div>
        <div className={styles["stages-wrapper"]}>
          <div className={styles["stage-container"]}>
            <div className={styles["stage"]}>{tierBiscuit(benefit?.tier)}</div>
          </div>
          <ReactMarkdown className={styles.content}>
            {currentLocale?.description || benefit?.description}
          </ReactMarkdown>
        </div>
      </>
    </Card>
  );

  const renderCommercialThemeCard = () => {
    return (
      <CommercialCard
        benefitDate={
          benefit?.startDate
            ? dayjs(benefit.startDate).format("MM/DD")
            : dayjs(benefit.activeDate).format("MM/DD")
        }
        title={currentLocale?.title || benefit?.title}
        prefixTitle={benefit?.shortDescription}
        desc={currentLocale?.description || benefit?.description}
        imgSrc={benefit.previewResourceUrl}
        type="5"
        onClick={handleOnClick}
      />
    );
  };

  return (
    <>
      {contextHolder}
      {storefront?.showImageOnly ||
      (storefront?.showImageOnly === null && benefit?.showImagesOnly)
        ? renderImageOnlyCard()
        : template === JapaneseTemplateName
        ? renderRegularAnimeThemeCard()
        : renderCommercialThemeCard()}
    </>
  );
};
