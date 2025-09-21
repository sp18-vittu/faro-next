import styles from "./notificationContainer.module.scss";

const NotificationContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${styles["notification-section"]} container`}>
      {children}
    </div>
  );
};

export default NotificationContainer;
