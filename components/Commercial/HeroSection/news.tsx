import React from "react";
import dayjs from "dayjs";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { useNotificationStore } from "@/state/NotificationState";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { Notification } from "@/shared/types/types";

import styles from "./heroSection.module.scss";

const News = ({ singleImage }: { singleImage: boolean }) => {
  const { t } = useTranslation("common");
  const storefront = useStorefrontStore((state) => state.storefront);
  const router = useRouter();

  function displayNotifications() {
    const returnArray: any[] = [];
    const notifications = storefront?.notifications;
    if (notifications && notifications?.length > 0) {
      notifications.forEach((el: Notification) => {
        returnArray.push(
          <div
            className={`${styles["news-item"]} ${
              el.pressReleaseId ? styles["pr-link"] : ""
            }`}
            onClick={() => {
              if (el.pressReleaseId) {
                router.push(
                  `/store/${storefront?.title}/press-releases/${el.pressReleaseId}`
                );
              }
            }}
          >
            <p className={styles["date"]}>
              {dayjs(el.scheduledDate).format("MMMM D - ")}
            </p>
            <p className={styles["text"]}>{el.message}</p>
          </div>
        );
      });
    }
    return returnArray;
  }

  // I need only 4 messages to be displayed write code
  return (
    <div className="container">
      <div
        className={`${styles["news-section"]} ${
          singleImage ? styles["single-image"] : ""
        }`}
      >
        <div className={styles["title"]}>
          <p>{t("NEWS")}</p>
          <hr />
        </div>
        {displayNotifications()}
      </div>
    </div>
  );
};

export default News;
