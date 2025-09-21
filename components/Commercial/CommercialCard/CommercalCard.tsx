import React, { useEffect, useState } from "react";
import { Button, Card, Tag, Tooltip, message } from "antd";
import Image from "next/image";

import styles from "./style.module.scss";

interface CollectionCardProps {
  benefitDate: string;
  type: string;
  title: string;
  desc: string;
  imgSrc: any;
  onClick: () => void;
  children?: React.ReactNode;
  prefixTitle?: string;
}

const { Meta } = Card;

const CommercialCard = ({
  type,
  title,
  desc,
  imgSrc,
  onClick,
  children,
  benefitDate,
  prefixTitle,
}: CollectionCardProps) => {
  return (
    <Card
      className={`${styles.card} ${styles[`type-${type}`]}`}
      onClick={onClick}
      cover={
        <div style={{ position: "relative" }}>
          <Image
            src={imgSrc}
            alt={title}
            width={351}
            height={182}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      }
    >
      <Meta
        title={
          <>
            <span>{prefixTitle}</span>
            {title}
          </>
        }
        description={desc}
      />
      {children && children}
    </Card>
  );
};

export default CommercialCard;
