import React from "react";
import dayjs from "dayjs";

import NotificationItem from "../NotificationItem";

import { useNotificationStore } from "@/state/NotificationState";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { Empty } from "antd";

const News = () => {
  const notifications = useNotificationStore((state) => state.notification);
  const storefront = useStorefrontStore((state) => state.storefront);

  // Function to format the scheduled date
  function formatScheduledDate(scheduledDate: any) {
    const currentDate = dayjs();
    const notificationDate = dayjs(scheduledDate);

    if (notificationDate.isSame(currentDate, "day")) {
      return `Today at ${notificationDate.format("h:mm A")}`;
    } else {
      return `${notificationDate.format(
        "dddd, D MMMM, YY"
      )} at ${notificationDate.format("h:mm A")}`;
    }
  }
  
  return (
    <>
      {notifications?.length > 0 ? (
        notifications?.map((item: any) => {
          return (
            <NotificationItem
              key={item.id}
              id={item.id}
              imageSrc={
                (item?.merchantNotifications?.length > 0 &&
                  item?.merchantNotifications[0]?.partner?.logoUrl) ||
                item?.benefit?.resourceUrl ||
                storefront?.logoUrl
              }
              objectFit={
                (item?.merchantNotifications?.length > 0 &&
                  item?.merchantNotifications[0]?.partner?.logoUrl) ||
                item?.benefit?.resourceUrl
                  ? "cover"
                  : "contain"
              }
              title={item.title}
              scheduledDate={formatScheduledDate(item.scheduledDate)}
              message={item.message}
            />
          );
        })
      ) : (
        <Empty description="No notifications found" style={{marginTop: 150}}/>
      )}
    </>
  );
};

export default News;
