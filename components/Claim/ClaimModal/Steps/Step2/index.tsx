import { Button, StepProps } from "antd";
import React, { useEffect } from "react";

import styles from "./style.module.scss";
import { lato } from "@/styles/fonts/fonts";
import { StepsProps } from "../..";

export const Step2 = (props: StepsProps) => {
    // const { advanceStep } = props;

    return (
        <div className={styles.container}>
            <div className={styles.token}>
                {/* <Token /> */}
            </div>
            <h1 className={`${styles.h1} ${lato.className}`}> <b className={styles.b}>3</b>/1000</h1>
            {/* <Button className={styles.button} onClick={advanceStep}>Claim</Button> */}
        </div>
    );
}