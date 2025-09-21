import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Steps } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Modal from "react-modal";

import { useModalStore } from "@/state/ModalStore";

import { Step1 } from "./Steps/Step1";
import { Step3 } from "./Steps/Step3";
import { CheckIn } from "./Steps/CheckIn";
import InviteUser from "./Steps/InviteUser";
import Signup from "./Steps/Signup";
import PreRegister from "./Steps/Signup/preRegister";
import ForgotPassword from "./Steps/ForgotPassword";

import { useWalletStore } from "@/state/WalletStore";
import { JapaneseTemplateName } from "@/constant";

import styles from "./style.module.scss";
import { shallow } from "zustand/shallow";

export interface StepsProps {
  // advanceStep: () => void;
  closeModal?: () => void;
  template?: string;
}

// Modal.setAppElement("#commercialPage");
// Modal.setAppElement("#landingPage");

const ClaimModal = ({
  template,
  parentId,
}: {
  template?: string;
  parentId: string;
}) => {
  const { t } = useTranslation("common");
  const [memberId, setMemberId] = useState<string>("");
  const isOpen = useModalStore((state) => state.claimModalVisible);
  const mode = useModalStore((state) => state.mode);
  const closeModal = useModalStore((state) => state.setClaimModalNotVisible);
  // const [currentStep, setCurrentStep] = React.useState(0);
  const steps = [
    { title: t("SIGN_UP") },
    // { title: "Claim" },
    { title: t("ADD_PASS") },
  ];

  useEffect(() => {
    Modal.setAppElement(`#${parentId}`);
  }, [parentId]);

  // useEffect(() => {
  //   if (mode === "signIn") {
  //     setCurrentStep(0);
  //   } else if (mode === "viewPass") {
  //     setCurrentStep(1);
  //   } else if (mode === "checkIn") {
  //     setCurrentStep(4);
  //   }
  // }, [mode]);

  // const advanceStep = React.useCallback(() => {
  //   setCurrentStep(currentStep + 1);
  // }, [setCurrentStep, currentStep]);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className={`${styles.modalContent} ${
        (mode === "forgotPassword" ||
          mode === "signIn" ||
          mode == "signUp" ||
          mode == "inviteUser" ||
          mode === "preRegister" ||
          mode === "viewPass") &&
        template !== JapaneseTemplateName
          ? styles.forgotPasswordModal
          : ""
      }`}
      overlayClassName={styles.modalOverlay}
    >
      <Button
        className={`${styles.closeButton} ${
          (mode === "forgotPassword" ||
            mode === "signIn" ||
            mode == "signUp" ||
            mode == "inviteUser" ||
            mode === "preRegister") &&
          template !== JapaneseTemplateName
            ? styles.commercialCloseButton
            : ""
        }`}
        type="primary"
        size="small"
        icon={<CloseOutlined />}
        onClick={closeModal}
      ></Button>
      {mode === "signIn" && (
        <Steps
          className={`${styles.steps} ${
            template === JapaneseTemplateName ? styles["anime-steps"] : ""
          }`}
          // current={currentStep}
          // items={steps}
          labelPlacement="vertical"
          responsive={false}
        />
      )}
      {mode === "signIn" && <Step1 template={template} />}
      {/* {currentStep === 1 && (<Step2 advanceStep={advanceStep} />)} */}
      {mode === "viewPass" && <Step3 template={template} />}
      {mode === "checkIn" && <CheckIn />}
      {mode === "inviteUser" && <InviteUser />}
      {mode === "signUp" && <Signup memberId={memberId} template={template} />}
      {mode === "faq" && <p>FAQ</p>}
      {mode === "forgotPassword" && <ForgotPassword template={template} />}
      {mode === "preRegister" && <PreRegister setMemberId={setMemberId} />}
    </Modal>
  );
};

export default ClaimModal;
