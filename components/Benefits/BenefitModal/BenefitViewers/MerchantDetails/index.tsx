import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Merchant, MerchantLocale } from "@/shared/types/types";
import Image from "next/image";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";
import { JapaneseTemplateName } from "@/constant";

import styles from "./style.module.scss";

interface MerchantDetailsPropType {
  merchant: Merchant;
  template?: string;
}

export const MerchantDetails = (props: MerchantDetailsPropType) => {
  const { merchant, template } = props;
  const [isTruncated, setIsTruncated] = useState(true);
  const [currentLocale, setCurrentLocale] = useState<MerchantLocale | null>(
    null
  );
  const currentLocaleId = useSelectedLocaleStore(
    (state) => state.currentLocaleId
  );
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (currentLocaleId && merchant) {
      const findLocale = merchant.locales.filter(
        (item) => item.localeId === currentLocaleId
      )[0];
      setCurrentLocale(findLocale);
    }
  }, [currentLocaleId, merchant]);

  const handleToggleExpand = () => {
    setIsTruncated(!isTruncated);
  };

  return (
    <>
      <div
        className={`${styles.container} ${
          template === JapaneseTemplateName ? styles["anime-container"] : styles["commercial-container"]
        }`}
      >
        <div className={styles["color-wrapper"]}>
          <div className={styles.merchantImageContainer}>
            <Image
              className={styles.merchantImage}
              fill={true}
              src={
                (currentLocale?.logoUrl || merchant.logoUrl) ??
                "/images/logo.png"
              }
              alt="merchant image"
            />
          </div>
          <div className={styles.merchantDetails}>
            {merchant.url && (
              <p className={styles.email}>
                <a href={merchant.url}>
                  {currentLocale?.name || merchant.name}
                </a>
              </p>
            )}
            {!merchant.url && (
              <p className={styles.email}>
                <p className={styles.title}>
                  {currentLocale?.name || merchant.name}
                </p>
              </p>
            )}
            <div ref={paragraphRef}>
              <ReactMarkdown
                className={`${styles.description} ${
                  isTruncated ? styles.truncated : ""
                }`}
              >
                {currentLocale?.description || merchant.description}
              </ReactMarkdown>
            </div>

            <button onClick={handleToggleExpand}>
              {isTruncated ? "...more" : "...less"}
            </button>
            {merchant.email && (
              <p className={styles.email}>
                <a href={`mailto:${merchant.email}`}>{merchant.email}</a>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
