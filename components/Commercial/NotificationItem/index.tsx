import React from "react";
import { Collapse } from "antd";
import Image from "next/image";

import NotificationContainer from "../NotificationContainer";

import styles from "./notificationItem.module.scss";

interface Notification {
  id: string | number;
  imageSrc: string;
  title: string;
  scheduledDate: string;
  message: string;
  objectFit: string;
}

const { Panel } = Collapse;

const NotificationItem = (item: Notification) => {
  // console.log(item);
  return (
    <NotificationContainer>
      <div className={styles["notification-item-container"]}>
        <Collapse accordion>
          <Panel
            key={item.id}
            header={
              <>
                <div className={styles["profile-pic-container"]}>
                  <Image
                    src={item.imageSrc}
                    alt="profile"
                    width={75}
                    height={75}
                    className={`${styles["profile-pic"]} ${styles[item.objectFit]}`}
                  />
                </div>
                <div className={styles["items-container"]}>
                  <div className={styles["title-container"]}>
                    <p className={styles["title"]}>{item.title}</p>
                    <p className={styles["time-stamp"]}>{item.scheduledDate}</p>
                  </div>
                </div>
              </>
            }
          >
            <p className={styles["message"]}>{item.message}</p>
          </Panel>
        </Collapse>
      </div>
    </NotificationContainer>
  );
};

export default NotificationItem;
