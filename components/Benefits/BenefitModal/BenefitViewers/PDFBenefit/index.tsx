import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { usePassStore } from "@/state/PassState";
import { useTranslation } from "react-i18next";

import { Benefit } from "@/shared/types/types";
import { earnPointsFromRelation } from "@/utils/points";

// import { PDFCard } from "@/components/Benefits/PDFComponents/PDFCard";

import styles from "./style.module.scss";
interface PDFBenefitPropType {
  benefit: Benefit;
}

const PDFViewer: any = dynamic<{}>(
  (): any => import("../../../PDFComponents/PDFViewer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
  }
);

export const PDFBenefit = ({ benefit }: PDFBenefitPropType) => {
  const { t } = useTranslation()
  const passData = usePassStore((state) => state.passData)

  useEffect(() => {
    let mounted = true
    if (mounted){
      earnPointsFromRelation(passData, benefit, t)
    }
  }, [])

  return (
    <div className={styles.container}>
      <PDFViewer url={benefit.BenefitResource[0].resourceUrl} />
      {/* <div className={styles.bookContainer}>
        <PDFCard />
        <PDFCard />
        <PDFCard />
        <PDFCard />
        <PDFCard />
        <PDFCard />
        <PDFCard />
      </div> */}
    </div>
  );
};
