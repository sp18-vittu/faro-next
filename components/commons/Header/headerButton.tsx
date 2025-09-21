import React, { useRef } from "react";
import {
  UserOutlined,
  MenuOutlined,
  WalletOutlined,
  EnvironmentOutlined,
  QuestionCircleOutlined,
  HomeOutlined,
  LogoutOutlined,
  GlobalOutlined,
  BellOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import { shallow } from "zustand/shallow";
import { useRouter } from "next/router";
import { trackEvent } from "fathom-client";
import {
  ControlledMenu,
  MenuItem,
  MenuButton,
  MenuDivider,
  useHover,
  useMenuState,
  SubMenu,
} from "@szhsin/react-menu";

import { usePassStore } from "@/state/PassState";
import { useModalStore } from "@/state/ModalStore";
import { useAppContext } from "@/context/appContext";
import { useCommercialPageStore } from "@/state/CommercialPage";

import { LoginMethod } from "@/shared/types/types";
import { useWalletStore } from "@/state/WalletStore";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { CommercialTemplateName, JapaneseTemplateName } from "@/constant";
import { FaroLocalStorage } from "@/utils/localStorage";

import styles from "./style.module.scss";

interface HeaderButtonProps {
  isLoading: boolean;
  template?: string;
  defaultLocale: string | undefined;
  renderLocales: () => {
    key: string;
    label: string | undefined;
    icon: JSX.Element | undefined;
  }[];
  handleLocaleSelection: ({}: any) => void;
  isPressRelease?: boolean;
  isPressReleaseDetail?: boolean;
}

export const HeaderButton = (props: HeaderButtonProps) => {
  const ref = useRef(null);
  const router = useRouter();
  const storefront = useStorefrontStore((state) => state.storefront);
  const [menuState, toggle] = useMenuState({ transition: true });
  const { anchorProps, hoverProps } = useHover(menuState.state, toggle);
  // const [defautlLocale, setDefaultLocale] = useState<string | undefined>("");

  const {
    isLoading,
    template,
    defaultLocale,
    renderLocales,
    handleLocaleSelection,
    isPressRelease,
    isPressReleaseDetail,
  } = props;

  const { loginFromDb, logoutMagicAndUser } = useAppContext() as any;
  const { t } = useTranslation("common");
  const isLoggedIn = useWalletStore((state: any) => state.isLoggedIn, shallow);
  const toggleModal = useModalStore((state) => state.setClaimModalVisible);
  const setViewPass = useModalStore((state) => state.setViewPass);
  const setCheckIn = useModalStore((state) => state.setCheckIn);
  const setInviteUsers = useModalStore((state) => state.setInviteUser);
  const setPage = useCommercialPageStore((state) => state.setPage);

  const currentWallet = useWalletStore(
    (state: any) => state.currentWallet,
    shallow
  );

  const passData = usePassStore((state) => state.passData);
  const pointsTotal = usePassStore((state) => state.pointsTotal);
  const address = currentWallet?.provider?.getAddress();

  const faroLocalStorage: FaroLocalStorage = new FaroLocalStorage(
    storefront?.title || "",
    storefront?.rememberMeInDays || 3
  );

  const pointsText = () => {
    return `Points: ${passData ? pointsTotal : "..."}`;
  };

  const checkLocalStorageForTokens = (): boolean => {
    // console.log(`checkLocalStorageForTokens - ${storefront?.loginMethod}, ${faroLocalStorage.getItem("authorization") &&
    // faroLocalStorage.getItem("magicToken")}, magicToke - ${faroLocalStorage.getItem("magicToken") ? true : false} -
    // auth cookie - ${faroLocalStorage.getItem("authorization") ? true : false}`)
    return storefront?.loginMethod === LoginMethod.DEFAULT
      ? faroLocalStorage.getItem("authorization")
      : faroLocalStorage.getItem("authorization") &&
          faroLocalStorage.getItem("magicToken");
  };

  return (
    <>
      <div ref={ref} {...anchorProps}>
        <MenuButton
          className={`${styles["menu-button-override"]}
      ${
        template !== JapaneseTemplateName
          ? styles["commercial-menu-button-override"]
          : ""
      } 
      `}
        >
          {isLoading ? (
            `${t("LOADING")}...`
          ) : (
            <>
              <MenuOutlined style={{ fontSize: "20px" }} />
              {/* <UserOutlined style={{ fontSize: "20px" }} /> */}
            </>
          )}
        </MenuButton>
      </div>

      <ControlledMenu
        {...hoverProps}
        {...menuState}
        align={"end"}
        arrow={true}
        className={styles["menu-dropdown"]}
        anchorRef={ref}
        onClose={() => toggle(false)}
        menuClassName={
          template === JapaneseTemplateName ? styles["anime-col-menu"] : ""
        }
      >
        {(checkLocalStorageForTokens() || loginFromDb) && (
          <>
            <MenuItem disabled className={styles["menu-item-override"]}>
              <div className={styles["menu-item-text"]}>{pointsText()}</div>
            </MenuItem>
            {!!storefront?.locales?.length && (
              <>
                <MenuDivider />
                <SubMenu
                  label={
                    <div className={styles["menu-item-text"]}>
                      {<GlobalOutlined />} {t("LANGUAGE")}
                    </div>
                  }
                  className={styles["languages-sub-menu"]}
                  direction="left"
                  arrow
                >
                  {renderLocales().map((item) => {
                    return (
                      <MenuItem
                        key={item.key}
                        onClick={() => handleLocaleSelection(item)}
                      >
                        {" "}
                        <div className={`${styles["menu-item-text"]}`}>
                          {defaultLocale === item.key && (
                            <span className={styles["selected"]}></span>
                          )}
                          {item.icon} &nbsp; {item.label}
                        </div>
                        {item.label}
                      </MenuItem>
                    );
                  })}
                </SubMenu>
              </>
            )}
            {storefront?.themeId === CommercialTemplateName &&
              (checkLocalStorageForTokens() || loginFromDb) && (
                <div className={styles["commercial-nav-options"]}>
                  <MenuDivider />
                  <MenuItem
                    onClick={() => {
                      setPage("Home");
                    }}
                    className={styles["menu-item-override"]}
                  >
                    <div className={styles["menu-item-text"]}>
                      <HomeOutlined /> &nbsp; {t("HOME")}
                    </div>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    onClick={() => {
                      setPage("News");
                    }}
                    className={styles["menu-item-override"]}
                  >
                    <div className={styles["menu-item-text"]}>
                      <BellOutlined /> &nbsp; {t("NEWS")}
                    </div>
                  </MenuItem>
                  <MenuDivider />

                  <MenuItem
                    onClick={() => {
                      setPage("Profile");
                    }}
                    className={styles["menu-item-override"]}
                  >
                    <div className={styles["menu-item-text"]}>
                      <UserOutlined /> &nbsp; {t("PROFILE")}
                    </div>
                  </MenuItem>
                </div>
              )}
            {!storefront?.hiddenMenuItems?.includes("viewPass") && (
              <MenuItem
                onClick={() => {
                  toggleModal();
                  setViewPass();
                }}
                className={styles["menu-item-override"]}
              >
                <div className={styles["menu-item-text"]}>
                  <WalletOutlined /> &nbsp; {t("VIEW_PASS")}
                </div>
              </MenuItem>
            )}
            {!storefront?.hiddenMenuItems?.includes("checkIn") && (
              <MenuItem
                onClick={() => {
                  toggleModal();
                  setCheckIn();
                }}
                className={styles["menu-item-override"]}
              >
                <div className={styles["menu-item-text"]}>
                  <EnvironmentOutlined /> &nbsp; {t("CHECK_IN")}
                </div>
              </MenuItem>
            )}
            {/* <MenuItem
                  className={styles["menu-item-override"]}
                  onClick={() => {
                    toggleModal();
                    setInviteUsers();
                  }}
                  >
                  <div className={styles["menu-item-text"]}>
                  <CopyOutlined /> &nbsp; {t("INVITE_USER")}
                  </div>
                </MenuItem> */}
            {!storefront?.hiddenMenuItems?.includes("faq") && (
              <MenuItem
                className={styles["menu-item-override"]}
                onClick={() => {
                  trackEvent("Redirected to FAQ Page", { _value: 1 });
                  if (router.asPath.includes("faq")) {
                    router.push(`/store/${storefront?.title?.toLowerCase()}`);
                  } else {
                    router.push(
                      `/store/${storefront?.title?.toLowerCase()}/faq`
                    );
                  }
                }}
              >
                <div className={styles["menu-item-text"]}>
                  {router.asPath.includes("faq") ? (
                    <>
                      <HomeOutlined /> &nbsp; {t("HOME")}
                    </>
                  ) : (
                    <>
                      <QuestionCircleOutlined /> &nbsp; {t("FAQ_TEXT")}
                    </>
                  )}
                </div>
              </MenuItem>
            )}
            {(checkLocalStorageForTokens() || loginFromDb) &&
              !isPressRelease &&
              !isPressReleaseDetail && (
                <>
                  <MenuDivider />
                  <MenuItem
                    className={styles["menu-item-override"]}
                    onClick={() => {
                      setPage("List");
                    }}
                  >
                    <div className={styles["menu-item-text"]}>
                      <OrderedListOutlined /> &nbsp;{" "}
                      {`${t("LIST")} ${t("VIEW")}`}
                    </div>
                  </MenuItem>
                </>
              )}
            {(checkLocalStorageForTokens() || loginFromDb) && (
              <>
                <MenuDivider />
                <MenuItem
                  className={styles["menu-item-override"]}
                  onClick={() => {
                    trackEvent("Sign Out Clicked", { _value: 1 });
                    router.push(
                      `/store/${storefront?.title?.toLowerCase()}/signout`
                    );
                  }}
                >
                  <div className={styles["menu-item-text"]}>
                    <LogoutOutlined /> &nbsp; {t("SIGN_OUT")}
                  </div>
                </MenuItem>
              </>
            )}

            {/*<MenuDivider />
            <MenuItem
              className={styles["menu-item-override"]}
              onClick={() => {
                setMarketingModal();
              }}
            >
              <div className={styles["menu-item-text"]}>
                <InfoCircleOutlined /> &nbsp; {t("PROGRAM_DETAILS")}
              </div>
            </MenuItem> */}
            {/* <MenuDivider /> */}
            {/* <MenuItem
              className={styles["menu-item-override"]}
              onClick={() => {
                setPromotionsModalVisible();
              }}
            >
              <div className={styles["menu-item-text"]}>
                <NotificationOutlined /> &nbsp; {t("PROMOTIONS")}
              </div>
            </MenuItem>
            <MenuDivider /> */}
          </>
        )}
      </ControlledMenu>
    </>
  );
};
