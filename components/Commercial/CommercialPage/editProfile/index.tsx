import { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Row, Col, message, Checkbox } from "antd";
import { useLoadScript } from "@react-google-maps/api";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/types";
import { useTranslation } from "next-i18next";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";

import { useAppContext } from "@/context/appContext";
import { useStorefrontStore } from "@/state/StorefrontStore";
import GooglePlacesAutoComplete from "@/components/GooglePlacesAutoComplete";
import env from "../../../../constant/env";
import { updateUser } from "@/components/Claim/ClaimModal/apiUtils";
import PasswordPolicies from "@/components/PasswordPolicies";
import Micons from "@/components/customAntd/micons";
import { MenuDivider } from "@szhsin/react-menu";

import styles from "./editProfile.module.scss";
import "react-datepicker/dist/react-datepicker.css";

interface EditProfile {
  type: string;
  isOpen: boolean;
  onClose: () => void;
}

const { Item } = Form;

const EditProfile = ({ type, isOpen, onClose }: EditProfile) => {
  const { t } = useTranslation("common");
  const [form] = Form.useForm();
  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>(
    undefined
  );
  const [addressEdit, setAddressEdit] = useState<boolean>(false);
  const [emailEdit, setEmailEdit] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [defaultLocation, setDefaultLocation] = useState<string>("");
  const { userDetails, setUserDetails, logoutMagicAndUser } =
    useAppContext() as any;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.GOOGLE_MAP_API_KEY || "",
    libraries: ["places"],
  });

  const watchLocation = Form.useWatch("location", form);
  const watchDate = Form.useWatch("dateOfBirth", form);
  const watchEmail = Form.useWatch("email", form); 
  const { TextArea } = Input;

  useEffect(() => {
    form.setFieldsValue({
      ...userDetails,
      password: "",
      passwordConfirmation: "",
      dateOfBirth: userDetails?.dateOfBirth
        ? dayjs(userDetails?.dateOfBirth)
        : null,
    });
    setPhoneNumber(userDetails?.phoneNumber);
    if (userDetails?.street1 || userDetails?.zipcode) {
      setDefaultLocation(`${userDetails?.street1}`);
      setAddressEdit(true);
    }
  }, [type, userDetails]);

  const storefront = useStorefrontStore((state) => state.storefront);
  const defaultCountry: any =
    storefront?.defaultSmsCountryCode || env.DEFAULT_CALLING_COUTRY || "US";
  const countries: any = storefront?.smsSupportedCountries.split(",") ||
    env.SUPPORTED_PHONE_COUNTRIES?.split(",") || ["US", "JP", "IN", "CA", "MY"];

  const handleClose = () => {
    setAddressEdit(false);
    setEmailEdit(false);
    onClose();
  }

  const handleSubmit = async (data: any) => {
    if (!phoneNumber) {
      data.phoneNumber = "";
      data.receiveNotifications = false;
    }

    if (data.dateOfBirth)
      data.dateOfBirth = data.dateOfBirth.format("YYYY-MM-DDTHH:mm:ssZ");

    setIsSubmitting(true);
    setAddressEdit(false);
    setEmailEdit(false);
    const response = await updateUser(data, storefront?.title);
    if (response?.status === 200) {
      if (type === "password") {
        logoutMagicAndUser();
      }
      setUserDetails(response.data);
      onClose();
    } else {
      message.error({
        content: response?.data?.message || t("SOMETHING_WENT_WRONG"),
        duration: 2,
        key: "error",
      });
    }
    setIsSubmitting(false);
  };

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
      location: undefined,
    });
    form.validateFields(["location"]);
    setAddressEdit(false);
    setEmailEdit(false);
  };

  return (
    <Modal
      footer={[
        <Button
          key="cancel"
          onClick={() => handleClose()}
          disabled={isSubmitting}
          className={styles["edit-profile-cancel"]}
        >
          {t("CANCEL")}
        </Button>,
        <Button
          key="Confirm"
          onClick={() => form.submit()}
          loading={isSubmitting}
          className={styles["edit-profile-confirm"]}
        >
          {t("CONFIRM")}
        </Button>,
      ]}
      title={type === "profile" ? t("EDIT_PROFILE") : t("CHANGE_PASSWORD")}
      centered
      destroyOnClose
      open={isOpen}
      onCancel={onClose}
      className={styles["profile-modal"]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={isSubmitting}
        autoComplete="off"
      >
        {type === "password" ? (
          <>
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
          </>
        ) : (
          <>
            <p className={styles["member-id"]}>{`${t(
              "MEMBER_ID"
            )}: ${userDetails?.memberId?.toUpperCase().replace(/\s/g, "")}`}</p>

            {isLoaded && !emailEdit && (
              <div className={styles["email-non-edit"]}>
                <p className={styles["email"]}>
                  {t("EMAIL")}: {userDetails?.email}
                </p>
                <Button type="link" onClick={() => setEmailEdit(true)}>
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
            {isLoaded && emailEdit && (
              <div  className={styles["email-non-edit"]}>
                <Col xs={12} sm={12}>
                  <Item
                    name="email"
                    label={t("EMAIL")}
                    rules={[
                      {
                        required: true,
                        message: `${t("ENTER_EMAIL")}`,
                      },
                    ]}
                    className={styles["email"]}
                  >
                    <Input />
                  </Item>
                </Col>
              </div>
            )}
            <MenuDivider />

            <Row gutter={10}>

              <Col xs={12} sm={12}>
                <Item
                  name="lastName"
                  label={t("LAST_NAME")}
                  rules={[
                    {
                      required: true,
                      message: `${t("ENTER_LAST_NAME")}`,
                    },
                  ]}
                  className={styles["first-name"]}
                >
                  <Input />
                </Item>
              </Col>
              <Col xs={12} sm={12}>
                <Item
                  name="firstName"
                  label={t("FIRST_NAME")}
                  rules={[
                    {
                      required: true,
                      message: `${t("ENTER_FIRST_NAME")}`,
                    },
                  ]}
                  className={styles["first-name"]}
                >
                  <Input />
                </Item>
              </Col>
            </Row>
            <Item
              name="dateOfBirth"
              label={t("DATE_OF_BIRTH")}
              className={styles["dob-container"]}
            >
              <DatePicker
                selected={form.getFieldValue("dateOfBirth")?.toDate()}
                onChange={(date: Date | null) => {
                  if (date) {
                    form.setFieldsValue({
                      dateOfBirth: dayjs(date),
                    });
                  }
                }}
                className={styles["date-of-birth"]}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={dayjs().subtract(1, "day").endOf("day").toDate()}
                // locale={navigator.language === "ja-JP" ? "ja" : "en-US"}
                dateFormat={
                  navigator.language === "en-US" ? "MM/dd/yyyy" : "yyyy/MM/dd"
                }
              />
            </Item>
            {isLoaded && !addressEdit && (
              <Item
                name="location"
                label="Address"
                rules={[
                  {
                    required: true,
                    message: "Please select an address"
                  }
                ]}
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
                  value={userDetails?.street1}
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

            <Item
              className={styles["hide-items"]}
              name="zipcode"
              label={t("POSTAL_CODE")}
            >
              <Input disabled={!watchLocation} />
            </Item>
            <Item
              className={styles["hide-items"]}
              name="state"
              label={t("PREFECTURE")}
            >
              <Input disabled={!watchLocation} />
            </Item>
            <Item
              className={styles["hide-items"]}
              name="city"
              label={t("CITY_TOWN_VILLAGE")}
            >
              <Input disabled={!watchLocation} />
            </Item>
            <Item
              className={styles["hide-items"]}
              name="street1"
              label={t("STREET_ADDRESS")}
            >
              <Input disabled={!watchLocation} />
            </Item>
            <Item name="street2" label={t("APARTMENT")}>
              <Input disabled={!watchLocation} />
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
                style={{ marginBottom: 0 }}
                className={styles["notification-checkbox"]}
              >
                <Checkbox>{t("NOTIFICATIONS_AGREEMENT")}</Checkbox>
              </Item>
            )}
            <Item
              name="receiveWebPush"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>{t("RECEIVE_WEB_NOTIFICATION")}</Checkbox>
            </Item>
            {(isLoaded && emailEdit) && (
              <p className={styles["email_change"]}>
                {t("EMAIL_CHANGE_WARNING").replace('${1}', watchEmail)}
              </p>
            )}
          </>
        )}
      </Form>
    </Modal>
  );
};

export default EditProfile;
