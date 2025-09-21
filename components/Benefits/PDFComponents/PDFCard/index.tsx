import Image from "next/image";
import React from "react";

import styles from "./style.module.scss";
import CoverImg from "../../../../public/cover.jpg";
import { usePDFModalStore } from "@/state/PDFModalStore";

export const PDFCard = () => {
    const openPDFModal = usePDFModalStore((state) => state.setVisible);

    const handleOnClick = React.useCallback(() => {
        openPDFModal();
    }, [openPDFModal]);

    return (
        <div className={styles.container} onClick={handleOnClick}>
            <Image className={styles.image} src={CoverImg} alt="test" fill={false} />
        </div>
    )
}
