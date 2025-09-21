import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form, Result, Input, Button } from "antd";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { resetPassword } from "@/utils/commonApiUtils";
import PasswordPolicies from "@/components/PasswordPolicies";
import { JapaneseTemplateName } from "@/constant";
import { useStorefrontStore } from "@/state/StorefrontStore";

import styles from "./resetPassword.module.scss";

const { Item } = Form;

export async function getServerSideProps({ locale }: any) {
  const localesData = await serverSideTranslations(locale, ["common"]);

  return {
    props: {
      ...localesData,
    },
  };
}

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resetComplete, setResetComplete] = useState<boolean>(false);
  const [successfulReset, setSuccessfulReset] = useState<boolean>(false);
  const [currentOrigin, setCurrentOrigin] = useState<string>("");
  const [form] = Form.useForm();
  const router = useRouter();
  const { query } = router;

  const { t } = useTranslation("common");
  const storefront = useStorefrontStore((state) => state.storefront);

  useEffect(() => {
    setCurrentOrigin(
      router ? new URL(router.asPath, window.location.origin).origin : ""
    );
  }, []);

  const onSubmit = async (data: {
    password: string;
    passwordConfirmation: string;
  }) => {
    setIsSubmitting(true);
    const response = await resetPassword(query.title, {
      ...data,
      token: query.token,
    });
    if (response.status === 200) {
      setResetComplete(true);
      setSuccessfulReset(true);
    } else {
      setResetComplete(true);
      setSuccessfulReset(false);
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles["reset-password"]}>
      {resetComplete ? (
        <Result
          status={successfulReset ? "success" : "error"}
          title={
            successfulReset
              ? t("PASSWORD_RESET_SUCCESS")
              : t("SOMETHING_WENT_WRONG")
          }
          subTitle={
            successfulReset && (
              <Button
                onClick={() => {
                  router.push(`${currentOrigin}/store/${query.title}`);
                }}
                className={
                  storefront?.themeId !== JapaneseTemplateName
                    ? `${styles["back-button"]}`
                    : ""
                }
              >
                {/* Go to {storefront?.name || query.title} storefront. */}
                {`${t("GO_TO_STORE")}`}
              </Button>
            )
          }
        />
      ) : (
        <Form
          form={form}
          onFinish={onSubmit}
          layout="vertical"
          disabled={isSubmitting}
          autoComplete="off"
        >
          <h1>{t("SET_NEW_PASSWORD")}</h1>
          <PasswordPolicies />
          <Item
            name="passwordConfirmation"
            label={t("CONFIRM_NEW_PASSWORD")}
            rules={[
              {
                required: true,
                message: `${t("CONFIRM_PASSWORD_REQUIRED")}`,
              },
              {
                validator: async (_, val) => {
                  const password = form.getFieldValue("password");
                  if (password && val && password !== val) {
                    return Promise.reject(t("PASSWORD_MISMATCH_ERROR"));
                  }
                  return Promise.resolve;
                },
              },
            ]}
          >
            <Input.Password visibilityToggle={false} />
          </Item>
          <Button
            htmlType="submit"
            loading={isSubmitting}
            type="primary"
            className={
              storefront?.themeId !== JapaneseTemplateName
                ? styles["reset-password-btn"]
                : ""
            }
          >
            {t("RESET_PASSWORD")}
          </Button>
        </Form>
      )}
    </div>
  );
};

export default ResetPassword;
