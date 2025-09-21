import { Button, Input, Form, Divider, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";
import env from "@/constant/env";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { message } from "antd";

import { useAppContext } from "@/context/appContext";
import { lato } from "@/styles/fonts/fonts";
import { StepsProps } from "../..";
import {
  getPass,
  login,
  defaultLogin,
} from "@/components/Claim/ClaimModal/apiUtils";

import { useStorefrontStore } from "@/state/StorefrontStore";
import { useModalStore } from "@/state/ModalStore";
import { useWalletStore } from "@/state/WalletStore";
import { E164Number } from "libphonenumber-js/types";
import { LoginMethod, PassData, PassOwnedItems } from "@/shared/types/types";
import { usePassStore } from "@/state/PassState";
import { getStoreFrontDetailsFromClient } from "@/utils/homePageApiUtils";
import { useBenefitStore } from "@/state/BenefitState";
import { getPassOwnedItems } from "@/utils/commonApiUtils";
import { JapaneseTemplateName } from "@/constant";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";
import { FaroLocalStorage } from "@/utils/localStorage";

import styles from "./style.module.scss";

export const Step1 = (props: StepsProps) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [form] = Form.useForm();
  // const setViewPass = useModalStore((state) => state.setViewPass);
 
  // const [isPending, startTransition] = useTransition();

  const { setLoginFromDb, logoutMagicAndUser, getUser } =
    useAppContext() as any;
  const setIsLoggedIn = useWalletStore(
    (state: any) => state.setIsLoggedIn,
    shallow
  );
  const isLoggedIn = useWalletStore((state: any) => state.isLoggedIn, shallow);
  const storefront = useStorefrontStore((state) => state.storefront, shallow);
  const setPassData = usePassStore((state) => state.setPassData);
  const setPointsTotal = usePassStore((state) => state.setPointsTotal);
  const setBenefits = useBenefitStore((state) => state.setBenefits);

  const setStorefront = useStorefrontStore((state) => state.setStorefront);

  const setPassOwnedItems = usePassStore((state) => state.setPassOwnedItems);
  const closeModal = useModalStore((state) => state.setClaimModalNotVisible);
  const setForgotPassword = useModalStore((state) => state.setForgotPassword);
  const setSignUp = useModalStore((state) => state.setSignUp);
  const setPreRegister = useModalStore((state) => state.setPreRegister);

  const currentWallet = useWalletStore(
    (state: any) => state.currentWallet,
    shallow
  );
  const magicInstance = useWalletStore(
    (state: any) => state.magicInstance,
    shallow
  );
  const setCurrentWallet = useWalletStore(
    (state: any) => state.setCurrentWallet,
    shallow
  );
  const allWallets = useWalletStore((state: any) => state.allWallets, shallow);

  const [isLoading, setIsLoading] = useState(false);
  const watchEmail = Form.useWatch("email", form);
  const watchPhone = Form.useWatch("phone", form);
  const { template } = props;
  const address = currentWallet?.provider?.getAddress();
  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>(
    undefined
  );

  let faroLocalStorage: FaroLocalStorage = new FaroLocalStorage(
    storefront?.title || "",
    storefront?.rememberMeInDays || 3
  );
  useEffect(() => {
    if (watchEmail) {
      form.resetFields(["phone"]);
    }
  }, [watchEmail, form]);

  useEffect(() => {
    if (watchPhone) {
      form.resetFields(["email"]);
    }
  }, [watchPhone, form]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    if (storefront?.loginMethod !== LoginMethod.DEFAULT) {
      try {
        await logoutMagicAndUser();
        const email = data.email;
        const phone = data.phone;
        let magicToken;
        if (email) {
          magicToken = await magicInstance.auth.loginWithEmailOTP({
            email,
          });
        } else {
          magicToken = await magicInstance.auth.loginWithSMS({
            phoneNumber: phone,
          });
        }

        if (magicToken) {
          faroLocalStorage.setItem("magicToken", magicToken);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.log("magic login err:", err);
        faroLocalStorage.removeItem("magicToken");
        faroLocalStorage.removeItem("authorization");
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    } else {
      //For Commercial template: default login
      const response = await defaultLogin(data, storefront?.title);
      if (response.status === 200) {
        if (response?.data?.data?.token) {
          faroLocalStorage.setItem(
            "authorization",
            `Bearer ${response?.data?.data?.token}`
          );
          setIsLoggedIn(true);
          getUser();
        }
      } else {
        message.error({
          content: response.data.message,
          duration: 2,
          key: "login-error",
        });
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const token = faroLocalStorage.getItem("authorization");
    // console.log('after OTP, before magicToken', address, isLoggedIn, token, storefront?.loginMethod)
   if (
      storefront?.loginMethod === LoginMethod.DEFAULT &&
      token &&
      isLoggedIn
    ) {
      closeModal();
      setIsLoading(false);
      setLoginFromDb(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isLoggedIn]);

  const defaultCountry: any =
    storefront?.defaultSmsCountryCode || env.DEFAULT_CALLING_COUTRY || "US";
  const countries: any = storefront?.smsSupportedCountries.split(",") ||
    env.SUPPORTED_PHONE_COUNTRIES?.split(",") || ["US", "JP", "IN", "CA", "MY"];

  return (
    <div
      className={`${styles.container} 
    ${template !== JapaneseTemplateName ? styles["commercial-container"] : ""}`}
    >
      <h1 className={`${styles.h1} ${lato.className}`}>
        {t("SIGN_IN_WITH_EMAIL")}
      </h1>

      <div className={styles["login-wrapper"]}>
        <Form form={form} onFinish={handleSubmit}>
          {(storefront?.loginMethod === LoginMethod.SMS ||
            storefront?.loginMethod === LoginMethod.EMAILANDSMS) && (
            <Form.Item
              name="phone"
              rules={[
                {
                  required: watchEmail ? false : true,
                  message: `${t("INPUT_PHONE")}`,
                  validator: (_, value) => {
                    if (watchEmail === undefined || watchEmail === "") {
                      if (isValidPhoneNumber(value)) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject(`${t("INVALID_PHONE")}`);
                      }
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <PhoneInput
                placeholder={`${t("ENTER_PHONE")}`}
                defaultCountry={defaultCountry}
                countries={countries}
                disabled={watchEmail ? true : false}
                className={styles["phone-input"]}
                onChange={(value?: E164Number | undefined) => {
                  setPhoneNumber(value);
                }}
              />
              {/* <Input  placeholder={`${t("ENTER_PHONE")}`} disabled={watchEmail ? true : false} /> */}
            </Form.Item>
          )}
          {storefront?.loginMethod === LoginMethod.EMAILANDSMS && (
            <Divider>{t("OR")}</Divider>
          )}
          {(storefront?.loginMethod === LoginMethod.EMAIL ||
            storefront?.loginMethod === LoginMethod.EMAILANDSMS ||
            storefront?.loginMethod === LoginMethod.DEFAULT) && (
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: `${t("INPUT_NOT_VALID")}`,
                },
                {
                  required: watchPhone ? false : true,
                  message: `${t("INPUT_EMAIL")}`,
                },
              ]}
            >
              <Input
                placeholder={`${t("ENTER_EMAIL")}`}
                // disabled={watchPhone ? true : false}
                disabled={
                  storefront?.loginMethod !== LoginMethod.DEFAULT &&
                  !!watchPhone
                }
              />
            </Form.Item>
          )}
          {storefront?.loginMethod === LoginMethod.DEFAULT && (
            <>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: `${t("ENTER_PASSWORD_ERROR")}` },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input.Password
                  visibilityToggle
                  placeholder={`${t("ENTER_PASSWORD_PLACEHOLDER")}`}
                />
              </Form.Item>
              <p
                className={`${styles["forgot-password"]} ${
                  template !== JapaneseTemplateName
                    ? styles["commercial-forgot-password"]
                    : ""
                }`}
                onClick={() => {
                  setForgotPassword();
                }}
              >
                {t("FORGOT_PASSWORD.TITLE")}
              </p>
            </>
          )}
          {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 0, span: 24 }} style={{ flex: "inherit"}}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}
          {/* {template === storefront?.loginMethod === LoginMethod.DEFAULT} */}
          <Button
            className={`${styles["button-continue"]} ${
              template === JapaneseTemplateName
                ? styles["anime-button-continue"]
                : styles["commercial-button-continue"]
            }`}
            htmlType="submit"
            disabled={isLoading}
          >
            {isLoading ? `${t("LOADING")}...` : t("CONTINUE")}
          </Button>
        </Form>
        {/* {storefront?.loginMethod === LoginMethod.DEFAULT && (
          <>
            <p
              className={`${styles["sign-up-text"]} ${
                template !== JapaneseTemplateName
                  ? styles["commercial-sign-up-text"]
                  : ""
              }`}
            >
              {`${t("NO_ACCOUNT")} `}
            </p>
            <p
              className={`${styles["sign-up-text"]} ${
                template !== JapaneseTemplateName
                  ? styles["commercial-sign-up-text"]
                  : ""
              }`}
              onClick={() => {
                storefront?.preRegisterUser ? setPreRegister() : setSignUp();
              }}
            >
              <span>{t("SIGN_UP")}</span>
            </p>
          </>
        )} */}
      </div>
      <ReactMarkdown
        className={`${styles.terms} ${
          template === JapaneseTemplateName
            ? styles["anime-span"]
            : styles["commercial-span"]
        }`}
      >
        {t("TERMS_OF_SERVICE")}
      </ReactMarkdown>

      {(storefront?.loginMethod === LoginMethod.EMAIL ||
        storefront?.loginMethod === LoginMethod.EMAILANDSMS) && (
        <span
          className={`${styles.span} ${
            template === JapaneseTemplateName ? styles["anime-span"] : ""
          }`}
        >
          {t("CHECK_SPAM")}
        </span>
      )}
    </div>
  );
};
