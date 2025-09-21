import React from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

import styles from "./style.module.scss";
import Bear from "../../../public/images/bear.svg";
import Twitter from "../../../public/icons/Twitter.svg";
import Discord from "../../../public/icons/Discord.svg";
import Medium from "../../../public/icons/Medium.svg";
import Globe from "../../../public/icons/Globe.svg";
import Mail from "../../../public/icons/mail.svg";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";
import { JapaneseTemplateName } from "@/constant";

export const Footer = ({ template }: { template?: string }) => {
  const storefront = useStorefrontStore((state) => state.storefront);
  const currentStorefrontLocale = useSelectedLocaleStore(
    (state) => state.currentStorefrontLocale
  );

  // console.log("template---- in footer", template);

  return (
    <footer
      className={`${
        template === JapaneseTemplateName ? styles.rowContainer : ""
      } ${
        template === JapaneseTemplateName
          ? styles["jap-footer"]
          : styles["commercial-footer"]
      }`}
    >
      {template !== JapaneseTemplateName ? (
        <>
          <p className={styles["commercial-footer-logo"]}>
            {currentStorefrontLocale?.companyName ||
              storefront?.companyName ||
              "Three Core AI, LLC."}{" "}
          </p>
          <div className={styles["commercial-footer-desc"]}>
            <ReactMarkdown>
              {currentStorefrontLocale?.footerText ||
                storefront?.footerText ||
                " "}
            </ReactMarkdown>
          </div>
          <div className={styles["footer-icons-container"]}>
            <div>
              {(currentStorefrontLocale?.websiteUrl ||
                storefront?.websiteUrl) && (
                <a
                  href={
                    currentStorefrontLocale?.websiteUrl ||
                    storefront?.websiteUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    className={styles.footerLogo}
                    src={Globe}
                    alt="Globe Logo"
                  />
                </a>
              )}
              {(currentStorefrontLocale?.twitterUrl ||
                storefront?.twitterUrl) && (
                <a
                  href={
                    currentStorefrontLocale?.twitterUrl ||
                    storefront?.twitterUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    className={styles.footerLogo}
                    src={Twitter}
                    alt="Twitter Logo"
                  />
                </a>
              )}
              {(currentStorefrontLocale?.discordUrl ||
                storefront?.discordUrl) && (
                <a
                  href={
                    currentStorefrontLocale?.discordUrl ||
                    storefront?.discordUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    className={styles.footerLogo}
                    src={Discord}
                    alt="Discord Logo"
                  />
                </a>
              )}
              {storefront?.mediumUrl && (
                <a
                  href={storefront?.mediumUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    className={styles.footerLogo}
                    src={Medium}
                    alt="Medium Logo"
                  />
                </a>
              )}
            </div>
          </div>
          <div className={styles["commercial-brand-name"]}>
            {`© ${new Date().getFullYear()} ${
              currentStorefrontLocale?.companyName ||
              storefront?.companyName ||
              "Three Core AI, LLC."
            }, All rights reserved.`}
            <span>
              {" "}
              Powered by{" "}
              <a
                href="https://www.threecore.ai/en/"
                target="_blank"
                rel="noreferrer"
                className={styles["faro-link"]}
              >
                Three Core AI, LLC.
              </a>
              .
            </span>
          </div>
        </>
      ) : (
        <>
          {template === JapaneseTemplateName && (
            <Image src={Bear} alt="" className={styles["bear"]} />
          )}

          <div className={styles.containerFooterBold}>
            <span className={styles.spanFooterBold}>
              {currentStorefrontLocale?.companyName ||
                storefront?.companyName ||
                "Three Core AI, LLC."}{" "}
            </span>
          </div>
          {(storefront?.footerText || currentStorefrontLocale?.footerText) && (
            <div className={styles.containerFooterRegular}>
              <ReactMarkdown className={styles.containerFooterRegular}>
                {currentStorefrontLocale?.footerText ||
                  storefront?.footerText ||
                  " "}
              </ReactMarkdown>
            </div>
          )}
          <div className={styles.footerLogoContainer}>
            <div>
              {(currentStorefrontLocale?.websiteUrl ||
                storefront?.websiteUrl) && (
                <a
                  href={
                    currentStorefrontLocale?.websiteUrl ||
                    storefront?.websiteUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    className={styles.footerLogo}
                    src={Globe}
                    alt="Globe Logo"
                  />
                </a>
              )}
              {(currentStorefrontLocale?.twitterUrl ||
                storefront?.twitterUrl) && (
                <a
                  href={
                    currentStorefrontLocale?.twitterUrl ||
                    storefront?.twitterUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    className={styles.footerLogo}
                    src={Twitter}
                    alt="Twitter Logo"
                  />
                </a>
              )}
              {(currentStorefrontLocale?.discordUrl ||
                storefront?.discordUrl) && (
                <a
                  href={
                    currentStorefrontLocale?.discordUrl ||
                    storefront?.discordUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    className={styles.footerLogo}
                    src={Discord}
                    alt="Discord Logo"
                  />
                </a>
              )}
              {storefront?.mediumUrl && (
                <a
                  href={storefront?.mediumUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    className={styles.footerLogo}
                    src={Medium}
                    alt="Medium Logo"
                  />
                </a>
              )}
            </div>
          </div>
          <div className={styles.copyright}>
            {`© ${new Date().getFullYear()} ${
              currentStorefrontLocale?.companyName ||
              storefront?.companyName ||
              "Three Core AI, LLC."
            }, All right reserved.`}
            <span>
              {" "}
              Powered by{" "}
              <a href="https://www.threecore.ai/en/" target="_blank" rel="noreferrer">
                Three Core AI, LLC.
              </a>
              .
            </span>
          </div>
        </>
      )}
    </footer>
  );
};
