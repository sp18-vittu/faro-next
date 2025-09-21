import React, { useEffect } from "react";
import { MessagePayload, getMessaging,  onMessage, NotificationPayload } from "firebase/messaging";
// import { useRouter } from "next/router";
import { notification } from 'antd';
import Image from "next/image";
import { FirebaseCloudMessaging } from "@/utils/firebaseCloudMessaging";
import styles from "./style.module.scss";

const Context = React.createContext({ name: 'Default' });

notification.config({
  placement: 'topRight',
  bottom: 50,
  maxCount: 2,
  top: 30,
});

const PushNotificationLayout = () => {
  // const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (payload: MessagePayload) => {
    const { notification = {} } = payload;
    api.open({
      key: Math.random() * 10000,
      message: notification?.title,
      description: renderMessageBody(notification),
      duration: 10,
    });
  }

  const renderMessageBody = (notification: NotificationPayload) => (
    <div className={styles.toastContainer}>
      {notification.image && (
        <div className={styles.imageContainer}>
          <Image
            src={notification.image}
            alt="notification image"
            fill={true}
          />
        </div>
      )}
      <div className={styles.messageContainer}>
        <span>{notification?.body}</span>
      </div>
    </div>
  )

  useEffect(() => {
      const firebaseCloudMessaging = new FirebaseCloudMessaging();
      // Event listener that listens for the push notification event in the background
      if ("serviceWorker" in navigator) {
        const messaging = getMessaging();
        // console.log(messaging)
        onMessage(messaging, (payload: MessagePayload) => {
          console.info("Push notification Message received. ", payload);
          openNotification(payload);
        });
        
      }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <>
      {contextHolder}
    </>
  );
}

export default PushNotificationLayout;