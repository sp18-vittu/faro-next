import { useState, useEffect } from "react";
import { CopyOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input } from "antd";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { useAppContext } from "@/context/appContext";
import { useStorefrontStore } from "@/state/StorefrontStore";

import styles from "./inviteUser.module.scss";

const { Item } = Form;

const InviteUser = () => {
  const [form] = Form.useForm();
  const { userDetails } = useAppContext() as any;
  const [currentOrigin, setCurrentOrigin] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const storefront = useStorefrontStore((state) => state.storefront);
  const router = useRouter();
  const { query, asPath } = router;
  const { t } = useTranslation("common");

  useEffect(() => {
    setCurrentOrigin(
      router ? new URL(router.asPath, window.location.origin).origin : ""
    );
  }, []);

  useEffect(() => {
    setLink(
      `${currentOrigin}/store/${query.title}?referralCode=${userDetails.referralCode}`
    );
  }, [currentOrigin, userDetails, query]);

  const onSubmit = (data: { email: string }) => {
    const subject = `Join ${storefront?.program?.name} and enjoy benefits.`;
    const body = `Use this link - ${link} to join the program.`;
    window.location.href = `mailto:${data.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className={styles["invite-user"]}>
      <h1>{t("INVITE_USER")}</h1>
      <Button
        icon={<CopyOutlined />}
        onClick={() => {
          navigator.clipboard.writeText(link);
        }}
      >
        {t("COPY_REFERRAL_LINK")}
      </Button>
      <Divider className={styles["referral-divider"]}>
        {t("OR_INVITE_VIA_EMAIL")}
      </Divider>
      <Form form={form} onFinish={onSubmit}>
        <Item
          name="email"
          rules={[
            { type: "email", message: `${t("INPUT_NOT_VALID")}` },
            {
              required: true,
              message: `${t("INVITE_ERROR")}`,
            },
          ]}
        >
          <Input placeholder={`${t("ENTER_EMAIL")}`} />
        </Item>
        <Button htmlType="submit">{t("SEND_INVITE")}</Button>
      </Form>
    </div>
  );
};

export default InviteUser;
