import { useState, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { Form, Input } from "antd";

import styles from "./styles.module.scss";

const { Item } = Form;

const PasswordPolicies = () => {
  const [passwordValidity, setPasswordValidity] = useState({
    number: false,
    special: false,
    length: false,
    spaces: false,
  });

  const { t } = useTranslation("common");
  const validationsData = useMemo(() => {
    return [
      {
        name: t("PASSWORD_LENGTH"),
        check: passwordValidity.length,
      },
      {
        name: t("PASSWORD_CHARACTER"),
        check: passwordValidity.special,
      },
      {
        name: t("PASSWORD_NUMBER"),
        check: passwordValidity.number,
      },
      {
        name: t("PASSWORD_SPACE"),
        check: passwordValidity.spaces,
      },
    ];
  }, [passwordValidity, t]);

  return (
    <>
      <Item
        name="password"
        label={t("PASSWORD")}
        rules={[
          {
            required: true,
            message: `${t("PASSWORD_REQUIRED")}`,
          },
          () => ({
            validator: (_, value) => {
              if (value) {
                const passwordPattern =
                  /^(?=.*[!@#$%^&*])(?=.*[0-9])(?!.*\s).{10,}$/;
                const validity = {
                  number: /\d/.test(value),
                  special: /[^\w\s]/.test(value),
                  length: value.length >= 10,
                  spaces: /^[^ ]+$/.test(value),
                };

                setPasswordValidity(validity);
                if (!passwordPattern.test(value)) {
                  return Promise.reject(t("PASSWORD_POLICY_UNSATISFIED"));
                }
              } else {

              }
              return Promise.resolve();
            },
          }),
        ]}
        style={{marginBottom: 10}}
      >
        <Input.Password visibilityToggle maxLength={16} autoComplete="new-password" />
      </Item>
      <div className={styles["password-validation-wrapper"]}>
        {validationsData.map((validation) => {
          return (
            <div
              className={`${styles["validation"]} ${
                validation.check ? styles["validated"] : ""
              }`}
              key={validation.name}
            >
              <div className={styles["dot"]}></div>
              <p className={styles["validation-name"]}>{validation.name}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PasswordPolicies;
