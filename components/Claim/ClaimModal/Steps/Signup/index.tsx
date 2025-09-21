import { useState, useEffect } from "react";
import { Form, Input, Button, message, Checkbox, Row, Col } from "antd";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/types";
import { useLoadScript } from "@react-google-maps/api";
import { shallow } from "zustand/shallow";
import { useTranslation } from "react-i18next";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

import env from "@/constant/env";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { useModalStore } from "@/state/ModalStore";
import { signUp } from "../../apiUtils";
import PasswordPolicies from "@/components/PasswordPolicies";
import { useAppContext } from "@/context/appContext";
import { FaroLocalStorage } from "@/utils/localStorage";
import { JapaneseTemplateName } from "@/constant";
import { lato } from "@/styles/fonts/fonts";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";
import GooglePlacesAutoComplete from "@/components/GooglePlacesAutoComplete";
import Micons from "@/components/customAntd/micons";

import styles from "./signup.module.scss";

const { Item } = Form;

const Signup = ({
  memberId,
  template,
}: {
  memberId: string;
  template?: string;
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { t } = useTranslation("common");
  const storefront = useStorefrontStore((state) => state.storefront, shallow);
  const setSignIn = useModalStore((state) => state.setSignIn);
  const setClaimModalNotVisible = useModalStore(
    (state) => state.setClaimModalNotVisible
  );
  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>(
    undefined
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [addressEdit, setAddressEdit] = useState<boolean>(false);
  const [defaultLocation, setDefaultLocation] = useState<string>("");
  const [isSignedUp, setIsSignedUp] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.GOOGLE_MAP_API_KEY || "",
    libraries: ["places"],
  });

  const watchLocation = Form.useWatch("location", form);

  const { TextArea } = Input;

  const { getUser } = useAppContext() as any;

  let faroLocalStorage: FaroLocalStorage = new FaroLocalStorage(
    storefront?.title || "",
    storefront?.rememberMeInDays || 3
  );

  const currentLocaleId = useSelectedLocaleStore(
    (state) => state.currentLocaleId
  );

  const onContinue = () => {
    faroLocalStorage.setItem("authorization", `Bearer ${token}`);
    getUser();
    setClaimModalNotVisible();
  };

  useEffect(() => {
    let timer: any;
    if (!isSubmitting && isSignedUp) {
      timer = setTimeout(() => {
        onContinue();
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSignedUp, isSubmitting]);

  const onSubmit = async (data: any) => {
    if (memberId) data.memberId = memberId;
    if (router.query.referralCode)
      data.referralCode = router.query.referralCode;
    setIsSubmitting(true);
    data.localeId = currentLocaleId;
    const response = await signUp(data, storefront?.title);
    if (response?.status === 200) {
      setIsSignedUp(true);
      setToken(response.data.token);
    } else {
      message.error({
        content: response?.data?.message?.startsWith(
          "User already exist for email"
        )
          ? t("DUPLICATE_EMAIL_ADDRESS")
          : t("SOMETHING_WENT_WRONG"),
        duration: 3,
        key: "error",
      });
    }
    setIsSubmitting(false);
  };

  const defaultCountry: any =
    storefront?.defaultSmsCountryCode || env.DEFAULT_CALLING_COUTRY || "US";
  const countries: any = storefront?.smsSupportedCountries.split(",") ||
    env.SUPPORTED_PHONE_COUNTRIES?.split(",") || ["US", "JP", "IN", "CA", "MY"];

  useEffect(() => {
    form.setFieldValue("memberId", memberId);
  }, [memberId]);

  const updateValues = (details: any) => {
    let state = null,
      zipcode = null,
      country = null,
      city = null,
      address = "";
    address = details?.formatted_address;
    details?.address_components?.forEach((component: any) => {
      if (component.types[0] === "postal_code") {
        zipcode = component.long_name;
        return;
      }
      if (component.types[0] === "country") {
        country = component.long_name;
        return;
      }
      if (component.types[0] === "administrative_area_level_1") {
        state = component.long_name;
        return;
      }
      if (component.types[0] === "locality") {
        city = component.long_name;
        return;
      }
    });

    form.setFieldsValue({
      location: details.formatted_address,
      street1: address,
      country: country,
      state: state,
      zipcode: zipcode,
      city: city,
    });
  };

  const onClear = () => {
    form.setFieldsValue({
      street1: "",
      country: "",
      state: "",
      zipcode: "",
      street2: "",
      city: "",
      location: "",
    });
  };

  return (
    <div
      className={`${styles["signup"]} ${
        template !== JapaneseTemplateName ? styles["commercial-signup"] : ""
      }`}
    >
      {isSignedUp ? (
        <>
          <div
            // className={styles["signup_confirmation"]}
            className={`${
              template !== JapaneseTemplateName
                ? styles["commercial_signup_confirmation"]
                : styles["signup_confirmation"]
            }`}
          >
            <h1 className={styles["signup_confirmation-h1"]}>
              {t("SIGN_UP_CONFIRMATION")}
            </h1>
            <Button
              type="primary"
              onClick={() => onContinue()}
              className={`${
                template !== JapaneseTemplateName
                  ? styles["submit-btn-continue"]
                  : ""
              }`}
            >
              {t("CONTINUE")}
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1
            className={`${
              template !== JapaneseTemplateName ? lato.className : ""
            }`}
            style={{
              marginBottom: template !== JapaneseTemplateName ? "10px" : "",
              marginTop: template !== JapaneseTemplateName ? "0" : "",
            }}
          >
            {t("SIGN_UP_DEFAULT")}
          </h1>
          <Form
            form={form}
            onFinish={onSubmit}
            layout="vertical"
            disabled={isSubmitting}
            autoComplete="off"
          >
            <p>{`${t("MEMBER_ID")}: ${memberId
              .toUpperCase()
              .replace(/\s/g, "")}`}</p>
            <Item
              name="email"
              label={`${t("EMAIL")}`}
              rules={[
                { required: true, message: `${t("INPUT_EMAIL")}` },
                {
                  type: "email",
                  message: `${t("INPUT_NOT_VALID")}`,
                },
              ]}
              className={`${
                template !== JapaneseTemplateName
                  ? styles["commercial-email"]
                  : ""
              }`}
            >
              <Input placeholder={`${t("ENTER_EMAIL")}`} />
            </Item>
            <PasswordPolicies />
            <Item
              name="passwordConfirmation"
              label={t("CONFIRM_PASSWORD")}
              dependencies={["password"]}
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
              className={`${
                template !== JapaneseTemplateName
                  ? styles["commercial-confirm-password"]
                  : ""
              }`}
            >
              <Input.Password visibilityToggle={false} maxLength={16} />
            </Item>
            <div
              className={`${
                template !== JapaneseTemplateName
                  ? styles["commercial-user-fields"]
                  : ""
              }`}
            >
              <Item
                className={`${
                  template !== JapaneseTemplateName
                    ? styles["commercial-user-name"]
                    : ""
                }`}
                name={`${
                  template !== JapaneseTemplateName ? "lastName" : "firstName"
                }`}
                label={`${
                  template !== JapaneseTemplateName
                    ? t("LAST_NAME")
                    : t("FIRST_NAME")
                }`}
                rules={[
                  {
                    required: true,
                    message:
                      template !== JapaneseTemplateName
                        ? `${t("ENTER_LAST_NAME")}`
                        : `${t("ENTER_FIRST_NAME")}`,
                  },
                ]}
              >
                <Input maxLength={30} />
              </Item>
              <Item
                name={`${
                  template !== JapaneseTemplateName ? "firstName" : "lastName"
                }`}
                label={`${
                  template !== JapaneseTemplateName
                    ? t("FIRST_NAME")
                    : t("LAST_NAME")
                }`}
                className={`${
                  template !== JapaneseTemplateName
                    ? styles["commercial-user-name"]
                    : ""
                }`}
                rules={[
                  {
                    required: true,
                    message:
                      template !== JapaneseTemplateName
                        ? `${t("ENTER_FIRST_NAME")}`
                        : `${t("ENTER_LAST_NAME")}`,
                  },
                ]}
              >
                <Input maxLength={30} />
              </Item>
            </div>
            {isLoaded && !addressEdit && (
              <Item
                name="location"
                label="Address"
                className={`${!watchLocation ? styles["address-item"] : ""}`}
              >
                <GooglePlacesAutoComplete
                  form={form}
                  updateValue={updateValues}
                  defaultValue={defaultLocation}
                  onClear={onClear}
                />{" "}
              </Item>
            )}
            {isLoaded && addressEdit && (
              <div className={styles["address-container"]}>
                <TextArea
                  rows={2}
                  disabled
                  className={styles["address-text-container"]}
                  // value={userDetails?.street1}
                ></TextArea>
                <Button type="link" onClick={() => setAddressEdit(false)}>
                  <Micons
                    icon="edit"
                    type="filled"
                    isHover={false}
                    style={{
                      fontSize: 20,
                      margin: "0 auto",
                      width: "max-content",
                    }}
                  />
                </Button>
              </div>
            )}
            {!watchLocation && (
              <Row gutter={10}>
                <Col xs={24}>
                  <p className={styles["tip-container"]}>{t("ADDRESS_TIP")}</p>
                </Col>
              </Row>
            )}
            <Item name="street2" label={t("APARTMENT")}>
              <Input />
            </Item>
            <Item
              name="phoneNumber"
              label=""
              rules={[
                {
                  validator: (_, value) => {
                    if (value) {
                      if (isValidPhoneNumber(value)) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject(`${t("INVALID_PHONE")}`);
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <PhoneInput
                placeholder={`${t("ENTER_PHONE")}`}
                defaultCountry={defaultCountry}
                countries={countries}
                className={styles["phone-input"]}
                onChange={(value?: E164Number | undefined) => {
                  setPhoneNumber(value);
                }}
              />
            </Item>
            {phoneNumber && (
              <Item
                name="receiveNotifications"
                valuePropName="checked"
                className={`${
                  template !== JapaneseTemplateName
                    ? styles["commercial-checkbox"]
                    : ""
                }`}
              >
                <Checkbox defaultChecked>
                  {t("NOTIFICATIONS_AGREEMENT")}
                </Checkbox>
              </Item>
            )}
            <Button
              htmlType="submit"
              type="primary"
              loading={isSubmitting}
              className={`${styles["submit-btn"]} ${
                template !== JapaneseTemplateName
                  ? styles["commercial-submit"]
                  : styles["submit"]
              }`}
            >
              {t("SUBMIT")}
            </Button>
          </Form>
          <Button
            icon={<ArrowLeftOutlined />}
            type="link"
            className={`${styles["back-to-login"]} ${
              template !== JapaneseTemplateName
                ? styles["commercial-back-to-login"]
                : ""
            }`}
            onClick={() => setSignIn()}
          >
            {t("BACK_TO_LOGIN")}
          </Button>
        </>
      )}
    </div>
  );
};
export default Signup;
