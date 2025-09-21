import { useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Form, Input, Button, message } from "antd";
import { useTranslation } from "next-i18next";

import { useStorefrontStore } from "@/state/StorefrontStore";
import { useModalStore } from "@/state/ModalStore";
import { forgotPassword } from "../../apiUtils";
import { JapaneseTemplateName } from "@/constant";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";

import styles from "./forgotPassword.module.scss";

const { Item } = Form;

const ForgotPassword = ({ template }: { template?: string }) => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState<string>("");
  const setSignIn = useModalStore((state) => state.setSignIn);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { t } = useTranslation("common");
  const currentLocaleId = useSelectedLocaleStore(
    (state) => state.currentLocaleId
  );

  const storefront = useStorefrontStore((state) => state.storefront);
  const onSubmit = async (data: { email: string; localeId: string | null }) => {
    setIsSubmitting(true);
    data.localeId = currentLocaleId;
    const response = await forgotPassword(data, storefront?.title);
    setEmail(data.email);
    setIsSubmitting(false);
  };

  return (
    <div className={`${styles["forgot-password"]}`}>
      {email ? (
        <h1
          className={`${styles["forgot-email-title"]} ${
            template !== JapaneseTemplateName
              ? styles["commercial-forgot-email-title"]
              : ""
          }`}
        >{`${t("FORGOT_PASSWORD.EMAIL_SENT")}`}</h1>
      ) : (
        <>
          <p
            className={`${styles["text"]} ${
              template !== JapaneseTemplateName ? styles["commercial-text"] : ""
            }`}
          >
            {t("FORGOT_PASSWORD.TITLE")}
          </p>
          <p
            className={`${styles["extra"]} ${
              template !== JapaneseTemplateName ? styles["commercial-text"] : ""
            }`}
          >
            {t("FORGOT_PASSWORD.MESSAGE")}
          </p>
          <Form
            form={form}
            onFinish={onSubmit}
            requiredMark={false}
            layout="vertical"
            disabled={isSubmitting}
          >
            <Item
              name="email"
              label={t("ENTER_EMAIL")}
              rules={[
                { type: "email", message: `${t("INPUT_NOT_VALID")}` },
                {
                  required: true,
                  message: `${t("INPUT_EMAIL")}`,
                },
              ]}
            >
              <Input placeholder={`${t("ENTER_EMAIL")}`} />
            </Item>
            <Button
              className={styles["request-password-reset"]}
              htmlType="submit"
              loading={isSubmitting}
            >
              {t("FORGOT_PASSWORD.REQUEST")}
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

export default ForgotPassword;
