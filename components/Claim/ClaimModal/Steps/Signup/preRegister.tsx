import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useTranslation } from "next-i18next";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { signUpWithMemberId } from "../../apiUtils";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { useModalStore } from "@/state/ModalStore";

import styles from "./signup.module.scss";

const { Item } = Form;
const PreRegister = ({
  setMemberId,
}: {
  setMemberId: (memberId: string) => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const storefront = useStorefrontStore((state) => state.storefront);
  const setSignUp = useModalStore((state) => state.setSignUp);
  const setSignIn = useModalStore((state) => state.setSignIn);
  const { t } = useTranslation("common");

  const handleSubmit = async (data: { memberId: string; password: string }) => {
    setIsSubmitting(true);
    const response = await signUpWithMemberId(data, storefront?.title);
    if (response?.status === 200 && response?.data?.data?.preRegistered) {
      setMemberId(data.memberId);
      setSignUp();
    } else {
      message.error({
        content: 
          response?.data?.message?.startsWith('User already registered with email') ? 
          t("DUPLICATE_MEMBER_ID") : t("SOMETHING_WENT_WRONG"),
        duration: 3,
        key: "error",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles["pre-register-container"]}>
      <Form onFinish={handleSubmit} layout="vertical" autoComplete="off">
        <Item
          name="memberId"
          label={t("PRE_REGISTER_MEMBER_ID")}
          rules={[{ required: true, message: `${t("MEMBER_ID_REQUIRED")}` }]}
        >
          <Input autoComplete="off" />
        </Item>
        <Item
          name="password"
          label={`${t("PRE_REGISTER_PASSWORD")}`}
          rules={[
            { required: true, message: `${t("MEMBER_PASSWORD_REQUIRED")}` },
          ]}
        >
          <Input.Password visibilityToggle autoComplete="new-password" />
        </Item>
        <Button
          htmlType="submit"
          loading={isSubmitting}
          className={styles["continue-btn"]}
        >
          {t("CONTINUE")}
        </Button>
      </Form>
      <Button
        icon={<ArrowLeftOutlined />}
        type="link"
        className={styles["back-to-login"]}
        onClick={() => setSignIn()}
      >
        {t("BACK_TO_LOGIN")}
      </Button>
    </div>
  );
};

export default PreRegister;
