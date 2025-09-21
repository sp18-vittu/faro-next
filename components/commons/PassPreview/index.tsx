import { useEffect, useState } from "react";
import { trackPageview, trackEvent } from "fathom-client";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { useRouter } from "next/router";

import { useAppContext } from "@/context/appContext";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { usePassStore } from "@/state/PassState";
import { getPass } from "@/components/Claim/ClaimModal/apiUtils";
import { getMobileOperatingSystem } from "@/utils/helper";

import addToGoogle from "@/public/images/addToGoogleWallet_en.svg";
import addToAppleWallet from "@/public/images/addToAppleWallet_en.svg";

import { LoginMethod, PassData } from "@/shared/types/types";
import { useWalletStore } from "@/state/WalletStore";
import { useModalStore } from "@/state/ModalStore";
import { JapaneseTemplateName } from "@/constant";

import Styles from "./style.module.scss";

const PassPreview = ({ template }: { template?: string }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { loginFromDb } = useAppContext() as any;

  const isLoggedInWithMagicAuth = useWalletStore(
    (state: any) => state.isLoggedIn
  );
  const currentWallet = useWalletStore((state: any) => state.currentWallet);
  const storefront = useStorefrontStore((state) => state.storefront);
  const passData = usePassStore((state) => state.passData);
  const setPassData = usePassStore((state) => state.setPassData);
  const setPointsTotal = usePassStore((state) => state.setPointsTotal);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [mobileDiv, setMobileDiv] = useState<Element[] | any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const closeModal = useModalStore((state) => state.setClaimModalNotVisible);

  const address = currentWallet?.provider?.getAddress();
  const checkMobileDevice = getMobileOperatingSystem();

  const parseAndHandlePassKitResponse = async (html: any) => {
    const parser = new DOMParser();
    const doc: any = parser.parseFromString(html, "text/html");

    const androidDiv: any = doc.getElementById("android-preview");
    const androidButtonParent = androidDiv.getElementsByClassName(
      "google-pay-default-wallet"
    )[0];
    const androidButtonSrc =
      androidButtonParent && androidButtonParent.getElementsByTagName("a")[0];

    if (androidDiv && androidButtonParent && checkMobileDevice === "Android") {
      const androidHtml = [];

      androidHtml.push(<p>{t("GOOGLE_WALLET")}</p>);
      androidHtml.push(<p>{t("ADD_TO_GOOGLE_WALLET")}</p>);
      androidHtml.push(
        <a
          href={androidButtonSrc.href}
          onClick={() => {
            trackEvent("Add to Wallet", { _value: 1 });
          }}
        >
          <Image
            src={addToGoogle}
            alt={t("SAVE_TO_GOOGLE_PAY")}
            width={180}
            height={180}
          />
        </a>
      );
      setMobileDiv(androidHtml);
      setLogoUrl(passData && passData?.tier.logoImageUrl);
    }
    if (androidDiv && checkMobileDevice === "iOS") {
      const iOSHtml = [];
      iOSHtml.push(<p>{t("APPLE_WALLET")}</p>);
      iOSHtml.push(<p>{t("ADD_TO_APPLE_WALLET")}</p>);
      iOSHtml.push(
        <a
          href={androidButtonSrc.href}
          onClick={() => {
            trackEvent("Add to Wallet", { _value: 1 });
          }}
        >
          <Image
            src={addToAppleWallet}
            alt={t("SAVE_TO_APPLE_PAY")}
            width={180}
          />
        </a>
      );
      setMobileDiv(iOSHtml);
      setLogoUrl(passData && passData?.tier.appleLogoImageUrl);
    }
    if (checkMobileDevice !== "iOS" && checkMobileDevice !== "Android") {
      const qrCodeImageSrc = doc.getElementsByClassName("qr-code")[0].src;
      const webHtml = [];
      webHtml.push(<p>{t("USE_CAMERA")}</p>);
      webHtml.push(<br />);
      webHtml.push(
        <Image
          src={qrCodeImageSrc}
          alt={t("SCAN_TEXT")}
          width={180}
          height={180}
        />
      );
      setMobileDiv(webHtml);
    }
    const qrCodeImageSrc = doc.getElementsByClassName("qr-code")[0]?.src;
    setScanImage(qrCodeImageSrc);
    setIsError(false);
  };

  useEffect(() => {
    if (
      (storefront?.loginMethod !== LoginMethod.DEFAULT &&
        isLoggedInWithMagicAuth &&
        address) ||
      loginFromDb
    ) {
      (async () => {
        setIsLoading(true);
        const response = await getPass(storefront?.title, true);
        if (response.status === 200) {
          setPassData(response.data as PassData);
          setPointsTotal((response.data as PassData).pointsTotal);
          fetch(response.data.passUrl)
            .then(function (response) {
              return response.text();
            })
            .then(function (html) {
              parseAndHandlePassKitResponse(html);
            })
            .catch(function (err) {
              console.log("Failed to fetch page: ", err);
              setIsError(true);
            })
            .finally(() => {
              setIsLoading(false);
            });
        } else {
          setIsLoading(false);
          setIsError(true);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedInWithMagicAuth, address]);

  useEffect(() => {
    trackPageview({
      url: `${storefront?.title}/passpreview`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={Styles["pass-wrapper"]}>
        {isLoading ? (
          <p className={Styles.loading}>{t("PASS_LOADING")}...</p>
        ) : isError ? (
          <p className={Styles.loading}>{t("ERROR_OCCURED")}</p>
        ) : (
          <>
            <div className={Styles["pass-area"]}>
              <div
                className={Styles["pass-header"]}
                style={{
                  backgroundColor: passData?.tier?.passColors?.stripColor,
                }}
              >
                <div className={Styles["pass-logo"]}>
                  {/* <h2>{passData?.tier?.programName}</h2> */}
                  {passData?.tier?.logoImageUrl && (
                    <Image
                      src={logoUrl || passData?.tier?.logoImageUrl}
                      fill={false}
                      width={checkMobileDevice === "iOS" ? 143 : 50}
                      height={50}
                      alt=""
                    />
                  )}
                </div>
                <p>
                  <span
                    style={{ color: passData?.tier?.passColors?.labelColor }}
                  >
                    {t("TIER")}
                  </span>
                  <br />
                  <span
                    style={{ color: passData?.tier?.passColors?.textColor }}
                  >
                    {passData?.tier?.name}
                  </span>
                  <br />
                  {storefront?.program?.pointsEnabled && (
                    <>
                      <span
                        style={{
                          color: passData?.tier?.passColors?.labelColor,
                        }}
                      >
                        {t("POINTS")}
                      </span>
                      <br />
                      <span
                        style={{ color: passData?.tier?.passColors?.textColor }}
                      >
                        {passData?.pointsTotal || 0}
                      </span>
                    </>
                  )}
                </p>
              </div>
              <div
                className={Styles["pass-content-wrapper"]}
                style={{
                  backgroundColor: passData?.tier?.passColors?.stripColor,
                }}
              >
                <div className={Styles["pass-image"]}>
                  {passData?.tier?.heroImageUrl && (
                    <Image src={passData?.tier?.heroImageUrl} fill alt="" />
                  )}
                </div>
                <div className={Styles["pass-content"]}>
                  <h3 style={{ color: passData?.tier?.passColors?.labelColor }}>
                    {t("BENEFITS")}
                  </h3>
                  <p style={{ color: passData?.tier?.passColors?.textColor }}>
                    {passData?.tier?.tierBenefits}
                  </p>

                  <div
                    className={`${Styles["qr-code"]} ${
                      !["unknown", "Windows Phone"].includes(checkMobileDevice)
                        ? Styles["hide-instructions"]
                        : ""
                    }`}
                    style={{ color: passData?.tier?.passColors?.textColor }}
                  >
                    {mobileDiv && mobileDiv}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className={Styles["close-button-container"]}>
        <Button
          className={` ${
            template !== JapaneseTemplateName
              ? Styles["commercial-black-button"]
              : Styles["black-button"]
          }`}
          onClick={closeModal}
        >
          {t("GO_BACK")}
        </Button>
      </div>
    </>
  );
};

export default PassPreview;
