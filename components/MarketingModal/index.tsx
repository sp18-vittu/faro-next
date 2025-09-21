import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Modal from "react-modal";

import { useModalStore } from "@/state/ModalStore";

import styles from "./style.module.scss";
import { getStoreFrontMarketingFromClient } from "@/utils/homePageApiUtils";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { StorefrontMarketing } from "@/shared/types/types";
import { ProgramTable } from "../ProgramTable";
import { PointsTable } from "../PointsTable";

export interface StepsProps {
	closeModal?: () => void;
}

Modal.setAppElement("#landingPage");

const MarketingModal = () => {
	const { t } = useTranslation("common");
	const isOpen = useModalStore((state) => state.marketingModalVisible);
	const closeModal = useModalStore((state) => state.setMarketingmModalNotVisible);
	const storefront = useStorefrontStore((state) => state.storefront);
	// const storefrontMarketing = useStorefrontStore((state) => state.storefrontMarketing);
	const setStorefrontMarketing = useStorefrontStore((state) => state.setStorefrontMarketing);
	const [isError, setIsError] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		if (storefront?.title) {
			setIsLoading(true);
			(async () => {
				const response = await getStoreFrontMarketingFromClient(storefront?.title);
				if (response) {
					setStorefrontMarketing(response as StorefrontMarketing);
					setIsLoading(false);
				} else {
					setIsLoading(false);
					setIsError(true);
				}
			})();
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [storefront]);


	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			className={styles.modalContent}
			overlayClassName={styles.modalOverlay}
		>
			<Button className={styles.closeButton} type="primary" size='small' icon={<CloseOutlined />} onClick={closeModal}></Button>
			<ProgramTable />
      		<PointsTable />
		</Modal>
	);
};

export default MarketingModal;
