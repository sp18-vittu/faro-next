import React from "react";

import Styles from "./styles/section.module.scss";
import { JapaneseTemplateName } from "@/constant";

interface sectionType {
  children: React.ReactNode;
  isGray?: boolean;
  sectionStyles?: React.CSSProperties;
  isFluid?: boolean;
  className?: string;
  template?: string;
}
const Section = ({
  children,
  isGray,
  sectionStyles,
  isFluid,
  className,
  template,
}: sectionType) => {
  return (
    <section
      className={`${Styles.section}${isGray ? ` ${Styles["grey-bg"]}` : ""}${
        className ? ` ${className}` : ""
      }${template === JapaneseTemplateName ? ` ${Styles["jap-section"]}` : ""}`}
      style={sectionStyles || {}}
    >
      <div
        className={`${isFluid ? "container-fluid" : "container"}${
          template === JapaneseTemplateName ? ` ${Styles["jap-container"]}` : ""
        }`}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;
