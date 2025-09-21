import { Button, Card } from "antd";
import React from "react";
import { StepsProps } from "../..";

import styles from "./style.module.scss";
import PassImg from "../../../../../public/pass.png";
import Image from "next/image";
import { CarouselSlider } from "@/components/CarouselSlider";
import { useStorefrontStore } from "@/state/StorefrontStore";

interface Step4Props {
    closeModal: () => void;
}

export const Step4 = (props: Step4Props) => {
    const { closeModal } = props;
    const storefront = useStorefrontStore((state) => state.storefront);

    return (
        <div className={styles.container}>
            <h2 className={styles.h2}>{storefront?.marketingHeadline}</h2>
            <h1 className={styles.h1}>{storefront?.marketingDesc}</h1>
            <CarouselSlider />
            <Button className={styles.button} onClick={closeModal}>Get Benefits</Button>
        </div>
    )
}