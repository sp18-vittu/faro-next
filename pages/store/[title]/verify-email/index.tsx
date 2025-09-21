import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Result, Spin } from "antd";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { verifyEmail } from "@/utils/commonApiUtils";

import styles from "./verifyEmail.module.scss";

export async function getServerSideProps({ locale }: any) {
  const localesData = await serverSideTranslations(locale, ["common"]);

  return {
    props: {
      ...localesData,
    },
  };
}

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentOrigin, setCurrentOrigin] = useState<string>("");
  const router = useRouter();
  const { query } = router;

  const { t } = useTranslation("common");

  useEffect(() => {
    setCurrentOrigin(
      router ? new URL(router.asPath, window.location.origin).origin : ""
    );
  }, []);

  useEffect(() => {
    const verify = async () => {
      const response = await verifyEmail(query.title, { token: query.token });
      if (response.status === 200) {
        setIsVerified(true);
      }
      setIsLoading(false);
    };

    if (query.token && query.title) verify();
  }, [query]);

  return isLoading ? (
    <div className={styles["spin-wrapper"]}>
      <Spin />
    </div>
  ) : (
    <Result
      className={styles["result"]}
      status={isVerified ? "success" : "error"}
      title={isVerified ? t("EMAIL_VERIFIED") : t("SOMETHING_WENT_WRONG")}
      subTitle={
        isVerified && (
          <Button
            onClick={() => {
              router.push(`${currentOrigin}/store/${query.title}`);
            }}
          >
            {/* {`${t("GO_TO")} ${query.title} ${t("STOREFRONT")}`} */}
            {`${t("GO_TO_STORE")}`}
          </Button>
        )
      }
    />
  );
};

export default VerifyEmail;
