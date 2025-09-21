import { useState } from "react";
import { Avatar, Button } from "antd";
import { useTranslation } from "next-i18next";
import Image from "next/image";

import { useAppContext } from "@/context/appContext";
import { usePassStore } from "@/state/PassState";

import EditProfile from "./editProfile";

import styles from "./profile.module.scss";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";

const Profile = () => {
  const { userDetails } = useAppContext() as any;
  const passData = usePassStore((state) => state.passData);
  const [editType, setEditType] = useState<string>("");
  const currentLocaleId = useSelectedLocaleStore(
    (state) => state.currentLocaleId
  );

  const { t } = useTranslation("common");

  return (
    <>
      <EditProfile
        type={editType}
        isOpen={!!editType}
        onClose={() => setEditType("")}
      />
      <div className="container">
        <div className={styles["profile-container"]}>
          {(userDetails?.firstName || userDetails?.lastName) && (
            <p
              className={styles["name"]}
            >{`${userDetails?.lastName || ''} ${userDetails?.firstName || ''}`}</p>
          )}
          <p className={styles["points"]}>
            {/* {`${passData?.tier?.name}`} */}
           
                {passData?.tier?.appleLogoImageUrl && (
                  <Image
                    src={passData.tier.appleLogoImageUrl}
                    alt={passData.tier.name}
                    height={30}
                    width={90}
                  />
                )}
          </p>
          {userDetails?.memberId && (
            <p className={styles["address"]}>{`${t("MEMBER_ID")} : ${
              userDetails.memberId
            }`}</p>
          )}
          {/* {userDetails?.phoneNumber && (
            <p className={styles["address"]}>{`${t("PHONE")} : ${
              userDetails.phoneNumber
            }`}</p>
          )}
          {userDetails?.street1 && (
            <p className={styles["address"]}>{userDetails?.street1}</p>
          )} */}

          <div className={styles["buttons-container"]}>
            <Button
              className={styles["edit-profile"]}
              onClick={() => {
                setEditType("profile");
              }}
            >
              {t("EDIT_PROFILE")}
            </Button>
            <Button
              className={styles["change-password"]}
              onClick={() => {
                setEditType("password");
              }}
            >
              {t("CHANGE_PASSWORD")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
