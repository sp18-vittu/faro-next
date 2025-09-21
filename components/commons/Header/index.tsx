import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Dropdown,
  List,
  message,
  Modal,
  notification,
  Popover,
  Space,
  Typography,
} from "antd";
import { trackEvent } from "fathom-client";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";
import { NotificationOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { FirebaseCloudMessaging } from "@/utils/firebaseCloudMessaging";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { useBenefitStore } from "@/state/BenefitState";
import { useNotificationStore } from "@/state/NotificationState";
import { usePassStore } from "@/state/PassState";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";
import { useCommercialPageStore } from "@/state/CommercialPage";
import { getPass, updateUser } from "@/components/Claim/ClaimModal/apiUtils";
import {
  BenefitNotification,
  PassData,
  PassOwnedItems,
} from "@/shared/types/types";
import { FaroLocalStorage } from "@/utils/localStorage";
import {
  CommercialTemplateName,
  JapaneseTemplateName,
  LOCALE_DETAILS,
  localeMapping,
} from "@/constant";

import Section from "@/components/Section";
import { HeaderButton } from "./headerButton";

import {
  StorefrontLocale,
  LocalesTypes,
  LoginMethod,
} from "@/shared/types/types";
import "@szhsin/react-menu/dist/core.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { useWalletStore } from "@/state/WalletStore";
import { getStoreFrontDetailsFromClient } from "@/utils/homePageApiUtils";
import {
  createFCMToken,
  getBenefitNotifications,
  getBenefitNotification,
  getPassOwnedItems,
} from "@/utils/commonApiUtils";
import { useAppContext } from "@/context/appContext";
import { useModalStore } from "@/state/ModalStore";
import PushNotificationLayout from "../PushNotifications";
import Expand from "../../../public/icons/expand.svg";

import styles from "./style.module.scss";

export const Header = ({
  template,
  isPressRelease,
  isPressReleaseDetail,
}: {
  template?: string;
  isPressRelease?: boolean;
  isPressReleaseDetail?: boolean;
}) => {
  const setPage = useCommercialPageStore((state) => state.setPage) as any;
  const storefront = useStorefrontStore((state) => state.storefront);
  const setBenefitsNotification = useNotificationStore(
    (state) => state.setBenefitsNotification
  );
  const faroLocalStorage: FaroLocalStorage = new FaroLocalStorage(
    storefront?.title || "",
    storefront?.rememberMeInDays || 3
  );

  const setSelectedLocale = useSelectedLocaleStore(
    (state) => state.setSelectedLocale
  );
  const currentLocaleId = useSelectedLocaleStore(
    (state) => state.currentLocaleId
  );
  const currentStorefrontLocale = useSelectedLocaleStore(
    (state) => state.currentStorefrontLocale
  );
  const setCurrentStorefrontLocale = useSelectedLocaleStore(
    (state) => state.setCurrentStorefrontLocale
  );

  // const toggleModal = useClaimModalStore((state) => state.setVisible);

  const setPassData = usePassStore((state) => state.setPassData);
  const setPointsTotal = usePassStore((state) => state.setPointsTotal);
  const passData = usePassStore((state) => state.passData);
  const setIsLoggedIn = useWalletStore((state: any) => state.setIsLoggedIn);
  const isLoggedIn = useWalletStore((state: any) => state.isLoggedIn);
  const setBenefits = useBenefitStore((state) => state.setBenefits);

  const setStorefront = useStorefrontStore((state) => state.setStorefront);
  const setPassOwnedItems = usePassStore((state) => state.setPassOwnedItems);
  const passOwnedItems = usePassStore((state) => state.passOwnedItems);

  const router = useRouter();
  const { t } = useTranslation("common");
  const { Paragraph } = Typography;

  const { loginFromDb, userDetails } = useAppContext() as any;
  // const isLoggedIn = useWalletStore((state: any) => state.isLoggedIn, shallow);
  const toggleModal = useModalStore((state) => state.setClaimModalVisible);
  const setSignIn = useModalStore((state) => state.setSignIn);
  const setPreRegister = useModalStore((state) => state.setPreRegister);

  // const setViewPass = useModalStore((state) => state.setViewPass);
  // const modalMode = useModalStore((state) => state.mode);

  const [notificationOpen, setNotiificationOpen] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMagicLogin, setIsMagicLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [defautlLocale, setDefaultLocale] = useState<string | undefined>("");
  const [messageApi, contextHolder] = message.useMessage();
  const [benefitNotifications, setBenefitNotiifications] =
    useState<Array<BenefitNotification> | null>(null);
  const [notificationQueue, setNotificationQueue] =
    useState<Array<BenefitNotification> | null>(null);

  const route = router.route.split("/");

  useEffect(() => {
    if (storefront) {
      setDefaultLocale(storefront.defaultLocaleId);
      setSelectedLocale(storefront.defaultLocaleId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storefront]);

  useEffect(() => {
    if (storefront?.loginMethod === LoginMethod.DEFAULT && isLoggedIn) {
      if (faroLocalStorage.getItem("authorization")) {
        (async () => {
          //  Now refresh the content based on user tier
          const {
            benefits,
            storefront: newStorefront,
            program,
          } = await getStoreFrontDetailsFromClient(storefront?.title);
          setBenefits(benefits);
          setStorefront(newStorefront);
          if (storefront?.loginMethod !== LoginMethod.DEFAULT) {
            /* Pass data and pointsTotal for default login method 
            will be set from the passes api called in the app.tsx file in getUser function*/
            const response = await getPass(storefront?.title);
            if (response.status === 200) {
              setPassData(response.data as PassData);
              setPointsTotal((response.data as PassData).pointsTotal);
            }
          }
          setIsLoading(false);
          storefront?.loginMethod !== LoginMethod.DEFAULT &&
            setIsLoggedIn(true);
        })();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => {
    //Notifications
    if (isLoggedIn && passData && !passOwnedItems) {
      (async () => {
        const passOwnedResponse = await getPassOwnedItems(passData?.passId);
        if (passOwnedResponse.status === 200) {
          setPassOwnedItems(passOwnedResponse.data as PassOwnedItems);
        }
        const notificationResponse = await getBenefitNotifications({
          storeFrontId: storefront?.title,
        });
        if (notificationResponse?.status === 200) {
          const arr: BenefitNotification[] = [];
          notificationResponse.data.forEach((item: BenefitNotification) => {
            if (item.notificationTrackers[0].viewCount <= 1) {
              arr.push(item);
            }
          });
          setBenefitNotiifications(notificationResponse.data);
          setBenefitsNotification(notificationResponse.data);
          if (userDetails?.receiveWebPush) {
            if (arr.length <= 5) {
              setNotificationQueue(arr);
            } else {
              notification.info({
                placement: "topRight",
                key: "notification",
                duration: 4,
                message: (
                  <p className={styles["notification-title"]}>
                    {`There are ${arr.length} notifications waiting.`}
                  </p>
                ),
              });
            }
          }
        }
      })();
    }
  }, [isLoggedIn, passData]);

  useEffect(() => {
    if (notificationQueue && notificationQueue.length !== 0) {
      notification.info({
        placement: "topRight",
        key: notificationQueue[0].id,
        duration: 4,
        message: (
          <>
            <p className={styles["notification-title"]}>
              {notificationQueue[0].title}
            </p>
            <p className={styles["notification-message"]}>
              {notificationQueue[0].message}
            </p>
          </>
        ),
        onClose: () => {
          getBenefitNotification({
            notificationId: notificationQueue[0].id,
            storeFrontId: storefront?.title,
          });
          setNotificationQueue((prev) => {
            if (prev) {
              const arr = [...prev];
              arr.shift();
              return arr;
            } else {
              return [];
            }
          });
        },
      });
    }
  }, [notificationQueue]);

  const confirm = async (e?: React.MouseEvent<HTMLElement>) => {
    const firebaseCloudMessaging = new FirebaseCloudMessaging(
      storefront?.title
    );
    const token = await firebaseCloudMessaging.init();
    if (token) {
      await createFCMToken(passData?.passId, token);
    }
    setNotiificationOpen(false);
  };

  const cancel = async (e?: React.MouseEvent<HTMLElement>) => {
    setNotiificationOpen(false);
    await updateUser(
      { ...userDetails, receiveWebPush: false },
      storefront?.title
    );
  };

  useEffect(() => {
    const token = faroLocalStorage.getItem("authorization");
    if (!token) {
      setIsLoading(false);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // console.log("isDownloaded", passData?.isDownloaded, passData);
    // if (passData &&  !passData?.isDownloaded && (!claimModalVisible || (claimModalVisible && modalMode !== 'viewPass'))) {
    //   messageApi.open({
    //     type: "info",
    //     content: t("DOWNLOAD_PASS"),
    //     duration: 5,
    //     onClick: () => {
    //       console.log('message clicked')
    //       toggleModal();
    //       setViewPass()
    //     },
    //   });
    // }
    (async () => {
      const firebaseCloudMessaging = new FirebaseCloudMessaging(
        storefront?.title
      );
      if (await firebaseCloudMessaging.isSupported()) {
        if (passData && !(await firebaseCloudMessaging.tokenInlocalforage())) {
          setNotiificationOpen(true);
          return;
        }
        if (
          passData &&
          !(await firebaseCloudMessaging.storeTitleInLocalforage())
        ) {
          setNotiificationOpen(true);
        }
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passData]);

  const renderItem = () => {
    const items = storefront?.locales.map((item: StorefrontLocale) => {
      const currentLocale = LOCALE_DETAILS.find(
        (local) => local.localeId === item.localeId
      );
      return {
        label: currentLocale?.title,
        icon: currentLocale?.icon,
        key: item.localeId,
      };
    });
    if (storefront?.defaultLocaleId) {
      const defaultLocale = LOCALE_DETAILS.find(
        (item) => item.localeId === storefront?.defaultLocaleId
      );
      if (!items?.find((item) => item.key === storefront?.defaultLocaleId)) {
        items?.unshift({
          label: defaultLocale?.title,
          icon: defaultLocale?.icon,
          key: storefront?.defaultLocaleId,
        });
      }
    }
    return items || [];
  };

  useEffect(() => {
    const { locale } = router;
    const localeKey = localeMapping[(locale as keyof LocalesTypes) || "en"];
    const selectedLocale: any = storefront?.locales.filter(
      (item) => item.localeId === localeKey
    )[0];
    setDefaultLocale(localeKey);
    setCurrentStorefrontLocale(selectedLocale);
    setSelectedLocale(localeKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, storefront]);

  const checkLocalStorageForTokens = (): boolean => {
    return storefront?.loginMethod === LoginMethod.DEFAULT
      ? faroLocalStorage.getItem("authorization")
      : faroLocalStorage.getItem("authorization") &&
          faroLocalStorage.getItem("magicToken");
  };

  const renderNotifcations = () => {
    const messages = benefitNotifications?.map((bNotification) => ({
      title: bNotification.title,
      message: bNotification.message,
      scheduledAt: dayjs(bNotification.scheduledDate).format("MMM, DD"),
    }));

    return (
      // Not able to add styling thru CSS
      // So added inline styling, PENDING: Figure out how to remove inline styling (TBD)
      <List
        size="small"
        style={{
          width: "290px",
          height: "425px",
          fontSize: "11px",
          overflowY: "auto",
        }}
        bordered
        dataSource={messages}
        renderItem={(item, index) => (
          <List.Item>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontSize: "12px",
                  fontWeight: "500",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    width: "75%",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    width: "25%",
                  }}
                >
                  {item.scheduledAt}
                </div>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  width: "100%",
                }}
              >
                <Paragraph
                  ellipsis={{ rows: 2, expandable: true, symbol: "..." }}
                >
                  {item.message}
                </Paragraph>
              </div>
            </div>
          </List.Item>
        )}
        pagination={{
          pageSize: 5,
          position: "bottom",
          size: "small",
          hideOnSinglePage: true,
          style: {
            margin: "4px 4px",
            fontSize: "10px",
          },
        }}
      />
    );
  };

  const handleLocaleSelection = ({ key }: any) => {
    const { pathname, asPath, query } = router;

    const selectedLocale: any = storefront?.locales.filter(
      (item) => item.localeId === key
    )[0];
    const locale =
      selectedLocale?.localeId?.split("_")[0] ??
      storefront?.defaultLocaleId?.split("_")[0];

    //update state with selections
    setDefaultLocale(key);
    setSelectedLocale(key);
    setCurrentStorefrontLocale(selectedLocale);
    trackEvent("Locale Changed", { _value: 1 });
    // refresh the page with selected language
    router.push({ pathname, query }, asPath, { locale: locale });
  };

  return (
    <header
      className={`${styles.header} ${
        template === JapaneseTemplateName
          ? styles[`header-${template}`]
          : styles[`header-${template}`]
      }`}
    >
      <Section
        // sectionStyles={{ paddingTop: 20, paddingBottom: 20 }}
        className={`${
          template === JapaneseTemplateName
            ? styles[`section`]
            : styles[`section-${template}`]
        }`}
        //className={styles[`section-commercial`]}
        // className={styles.section}
      >
        <div
          //className={styles["header-wrapper"]}
          className={`${
            template === JapaneseTemplateName
              ? styles[`header-wrapper`]
              : styles[`commercial-header-wrapper`]
          }`}
        >
          <div className={styles["logo-container"]}>
            <div className={styles.logo}>
              {storefront && (
                <Image
                  fill
                  src={currentStorefrontLocale?.logoUrl || storefront.logoUrl}
                  alt="brand logo"
                  onClick={() => {
                    trackEvent("Home Page Logo Clicked", { _value: 1 });
                    router.push(`/store/${storefront?.title?.toLowerCase()}`);
                    if (storefront?.themeId === CommercialTemplateName) {
                      setPage("Home");
                    }
                  }}
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
            {loginFromDb &&
              storefront?.themeId !== JapaneseTemplateName &&
              userDetails && (
                <div className={styles["userDetails"]}>
                  <p>
                    {`${userDetails?.lastName || ""} ${
                      userDetails?.firstName || ""
                    }`}{" "}
                    {userDetails?.lastName && currentLocaleId === "ja_JP"
                      ? " 様"
                      : ""}
                  </p>
                  {passData?.tier?.appleLogoImageUrl && (
                    <Image
                      src={passData.tier.appleLogoImageUrl}
                      alt={passData.tier.name}
                      height={30}
                      width={90}
                    />
                  )}
                </div>
              )}
          </div>
          {/* <div className={styles["empty-container"]}>
          </div> */}

          <nav className={styles["commercial-nav"]}>
            <ul>
              {((storefront?.themeId === CommercialTemplateName &&
                (checkLocalStorageForTokens() || loginFromDb)) ||
                isPressRelease ||
                isPressReleaseDetail) && (
                <li
                  onClick={() => {
                    if (isPressRelease || isPressReleaseDetail) {
                      router.push(`/store/${storefront?.title}`);
                    } else {
                      setPage("Home");
                    }
                  }}
                >
                  {t("HOME")}
                </li>
              )}
              {storefront?.themeId === CommercialTemplateName &&
                (checkLocalStorageForTokens() || loginFromDb) &&
                !isPressRelease &&
                !isPressReleaseDetail && (
                  <>
                    <li onClick={() => setPage("News")}>{t("NEWS")}</li>
                    <li onClick={() => setPage("Profile")}>{t("PROFILE")}</li>
                  </>
                )}
              {!isPressRelease && (
                <li
                  onClick={() => {
                    router.push(`/store/${storefront?.title}/press-releases`);
                  }}
                >
                  {t("PRESS_RELEASES")}
                </li>
              )}
            </ul>
          </nav>

          <div className={`${styles["locale-container-header"]}`}>
            {!(checkLocalStorageForTokens() || loginFromDb) &&
              template === JapaneseTemplateName && (
                <div className={`${styles["locale-container"]}`}>
                  <Dropdown
                    menu={{
                      items: renderItem(),
                      onClick: handleLocaleSelection,
                    }}
                    trigger={["click", "hover"]}
                    className={styles["locale-dropdown"]}
                    placement="bottomCenter"
                    arrow
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        {
                          LOCALE_DETAILS.find(
                            (item) => item.localeId === defautlLocale
                          )?.icon
                        }
                        {
                          LOCALE_DETAILS.find(
                            (item) => item.localeId === defautlLocale
                          )?.title
                        }
                        <Image src={Expand} alt="expand" />
                      </Space>
                    </a>
                  </Dropdown>
                </div>
              )}

            <div
              className={`${styles["menu-container"]}${
                template === JapaneseTemplateName
                  ? ` ${styles["jp-menu-container"]}`
                  : ` ${styles["commercial-menu-container"]}`
              }`}
            >
              {route[route.length - 1] === "faq" &&
              storefront?.loginMethod !== LoginMethod.DEFAULT ? (
                <Button
                  className={`${
                    template === JapaneseTemplateName
                      ? styles["black-button"]
                      : styles["commercial-black-button"]
                  }`}
                  onClick={() => {
                    trackEvent("Directed to Home Page", { _value: 1 });
                    router.push(`/store/${storefront?.title?.toLowerCase()}`);
                  }}
                >
                  {t("HOME")}
                </Button>
              ) : (
                storefront?.loginMethod !== LoginMethod.DEFAULT && (
                  <Button
                    className={`${
                      template === JapaneseTemplateName
                        ? styles["black-button"]
                        : styles["commercial-black-button"]
                    }`}
                    onClick={() => {
                      trackEvent("Redirected to FAQ Page", { _value: 1 });
                      router.push(
                        `/store/${storefront?.title?.toLowerCase()}/faq`
                      );
                    }}
                  >
                    {t("Q&A_CONTACT")}
                  </Button>
                )
              )}
              {/* <Button
                className={`${
                  template === JapaneseTemplateName
                    ? styles["black-button"]
                    : styles["commercial-black-button"]
                }`}
                onClick={() => {
                  router.push(`/store/${storefront?.title}/press-releases`);
                }}
                style={{ marginRight: 0, width: "max-content" }}
              >
                {t("PRESS_RELEASES")}
              </Button> */}
              {!(checkLocalStorageForTokens() || loginFromDb) && (
                <Button
                  className={`${
                    template === JapaneseTemplateName
                      ? styles["black-button"]
                      : styles["commercial-black-button"]
                  }`}
                  onClick={() => {
                    toggleModal();
                    setPreRegister();
                    trackEvent("Registeration Intiated", { _value: 1 });
                  }}
                  style={{ marginRight: 0 }}
                >
                  {/* <LoginOutlined /> &nbsp; */ t("REGISTER")}
                </Button>
              )}
              {!(checkLocalStorageForTokens() || loginFromDb) && (
                <Button
                  className={`${
                    template === JapaneseTemplateName
                      ? styles["black-button"]
                      : styles["commercial-black-button"]
                  }`}
                  onClick={() => {
                    toggleModal();
                    setSignIn();
                    trackEvent("Login Initiated", { _value: 1 });
                  }}
                >
                  {/* <LoginOutlined /> &nbsp; */ t("SIGN_IN")}
                </Button>
              )}
              {(checkLocalStorageForTokens() || loginFromDb) && (
                <HeaderButton
                  isLoading={isLoading}
                  template={template}
                  defaultLocale={defautlLocale}
                  renderLocales={renderItem}
                  handleLocaleSelection={handleLocaleSelection}
                  isPressRelease={isPressRelease}
                  isPressReleaseDetail={isPressReleaseDetail}
                />
              )}
              <div
                className={`${
                  template === JapaneseTemplateName
                    ? styles["bell-container"]
                    : styles["commercial-bell-container"]
                }`}
              >
                {(checkLocalStorageForTokens() || loginFromDb) && (
                  <Popover
                    content={renderNotifcations()}
                    trigger="click"
                    style={{
                      marginRight: "10px",
                    }}
                    placement="bottomLeft"
                  >
                    <Badge dot count={benefitNotifications?.length || 0}>
                      <NotificationOutlined
                        style={{ fontSize: "24px", cursor: "pointer" }}
                      />
                    </Badge>
                  </Popover>
                )}
              </div>
            </div>
            {!(checkLocalStorageForTokens() || loginFromDb) &&
              template !== JapaneseTemplateName &&
              !!storefront?.locales?.length && (
                <div className={`${styles["commercial-locale-container"]}`}>
                  <Dropdown
                    menu={{
                      items: renderItem(),
                      onClick: handleLocaleSelection,
                    }}
                    trigger={["click", "hover"]}
                    className={styles["locale-dropdown"]}
                    placement="bottomCenter"
                    arrow
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        {
                          LOCALE_DETAILS.find(
                            (item) => item.localeId === defautlLocale
                          )?.icon
                        }
                        {
                          LOCALE_DETAILS.find(
                            (item) => item.localeId === defautlLocale
                          )?.title
                        }
                        <Image src={Expand} alt="expand" />
                      </Space>
                    </a>
                  </Dropdown>
                </div>
              )}
          </div>
        </div>
      </Section>
      {contextHolder}
      <Modal
        title={
          currentStorefrontLocale?.heroHeadline || storefront?.heroHeadline
        }
        open={notificationOpen}
        onOk={confirm}
        onCancel={cancel}
        okText={t("YES")}
        cancelText={t("NO")}
      >
        <p>
          {template === JapaneseTemplateName
            ? t("NOTIFICATION_REQUEST")
            : t("COMMERCIAL_NOTIFICATION_REQUEST")}
        </p>
      </Modal>
      <PushNotificationLayout />
    </header>
  );
};
