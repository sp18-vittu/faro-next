import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Modal from "react-modal";

import { useModalStore } from "@/state/ModalStore";

import styles from "./style.module.scss";
import { Promotions } from "../Promotions";

export interface StepsProps {
	closeModal?: () => void;
}

Modal.setAppElement("#landingPage");

const PromotionModal = () => {
	const { t } = useTranslation("common");
	const isOpen = useModalStore((state) => state.promotionsModalVisible);
	const closeModal = useModalStore((state) => state.setPromotionsmModalNotVisible);


	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			className={styles.modalContent}
			overlayClassName={styles.modalOverlay}
		>
			<Button className={styles.closeButton} type="primary" size='small' icon={<CloseOutlined />} onClick={closeModal}></Button>
			<Promotions />
		</Modal>
	);
};

export default PromotionModal;