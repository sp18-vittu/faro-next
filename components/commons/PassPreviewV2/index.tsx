import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { useAppContext } from "@/context/appContext";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { usePassStore } from "@/state/PassState";
import { getPass } from "@/components/Claim/ClaimModal/apiUtils";

import { LoginMethod, PassData } from "@/shared/types/types";
import { useWalletStore } from "@/state/WalletStore";

import Styles from "./style.module.scss";

const PassPreviewV2 = () => {
  const { t } = useTranslation("common");
  const { loginFromDb } = useAppContext() as any;
  const currentWallet = useWalletStore((state: any) => state.currentWallet);
  const storefront = useStorefrontStore((state) => state.storefront);
  const passData = usePassStore((state) => state.passData)
  const setPassData = usePassStore((state) => state.setPassData)
  const setPointsTotal = usePassStore((state) => state.setPointsTotal);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const address = currentWallet?.provider?.getAddress();
  // const checkMobileDevice = getMobileOperatingSystem();
  useEffect(() => {
    if ((storefront?.loginMethod !== LoginMethod.DEFAULT && address && loginFromDb) || loginFromDb) {
      (async () => {
        setIsLoading(true);
        const response = await getPass(storefront?.title, true);
        if (response.status === 200) {
          setPassData(response.data as PassData);
          setPointsTotal((response.data as PassData).pointsTotal);
          setIsLoading(false);
          setIsError(false);
          setIsLoaded(true);
        } else {
          setIsLoading(false);
          setIsError(true);
          setIsLoaded(false);
        }
      })();
    }
  }, [loginFromDb, address, storefront]);

  return (
    <div className={Styles["pass-wrapper"]}>
      {isLoading ? (
        <p className={Styles.loading}>{t("PASS_LOADING")}...</p>
      ) : isError ? (
        <p className={Styles.loading}>{t("ERROR_OCCURED")}</p>
      ) : (
        <>
          <div className={Styles["pass-area"]}>
            {isLoaded && (
              <iframe
                src={(passData && passData?.passUrl) || ""}
                allowFullScreen={false}
                height={"100%"}
                width={"100%"}
              />
            )}
            {/* <div className={Styles["pass-header"]}  style={{backgroundColor: passData?.tier?.passColors?.stripColor}}>
              <div className={Styles["pass-logo"]}>
                {passData && (
                  <Image
                    src={logoUrl || passData?.tier?.logoImageUrl}
                    fill={false}
                    width={checkMobileDevice === 'iOS' ? 143 : 50}
                    height={50}
                    alt=""
                  />
                )}
              </div>
              <p>
                <span style={{color: passData?.tier?.passColors?.labelColor}}>Tier</span>
                <br />
                <span  style={{color: passData?.tier?.passColors?.textColor}}>{passData?.tier?.name}</span><br />
                {(storefront?.program?.pointsEnabled && (
                  <>
                    <span style={{color: passData?.tier?.passColors?.labelColor}}>Points</span>
                    <br />
                    <span  style={{color: passData?.tier?.passColors?.textColor}}>{passData?.pointsTotal || 0}</span>
                  </>
                ))}
              </p>
            </div>
            <div className={Styles["pass-content-wrapper"]} style={{backgroundColor: passData?.tier?.passColors?.stripColor}}>
              <div className={Styles["pass-image"]}>
                {passData && (
                  <Image src={passData?.tier?.heroImageUrl} fill alt="" />
                )}
              </div>
              <div className={Styles["pass-content"]}>
                <h3 style={{color: passData?.tier?.passColors?.labelColor}}>Benefits</h3>
                <p style={{color: passData?.tier?.passColors?.textColor}}>{passData?.tier?.tierBenefits}</p>

                <div className={Styles["qr-code"]}  style={{color: passData?.tier?.passColors?.textColor}}>
                  {mobileDiv && (
                    mobileDiv
                  )}
                </div>
              </div>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};

export default PassPreviewV2;
