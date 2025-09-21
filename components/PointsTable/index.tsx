import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";

import {
  Storefront,
  PointsData,
  PointsDataLocale,
  StorefrontMarketing,
} from "@/shared/types/types";
import Micons from "@/components/customAntd/micons";
import Section from "../Section";

import Styles from "./style.module.scss";
import { Table } from "antd";
import { JapaneseTemplateName } from "@/constant";

export const PointsTable = ({
  isFaq,
  template,
}: {
  isFaq?: boolean;
  template?: string;
}) => {
  const storefront: StorefrontMarketing | null = useStorefrontStore(
    (state) => state.storefrontMarketing
  );
  const currentLocaleId = useSelectedLocaleStore(
    (state) => state.currentLocaleId
  );
  const currentStorefrontLocale = useSelectedLocaleStore(
    (state) => state.currentStorefrontLocale
  );
  const [pointsMarketingData, setPointsMarketingData] = useState<
    PointsData[] | null
  >(null);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (storefront?.pointsMarketingData) {
      setPointsMarketingData(
        storefront.pointsMarketingData?.sort((a, b) => {
          if (a.position < b.position) {
            return -1;
          }
          if (a.position > b.position) {
            return 1;
          }
          return 0;
        })
      );
    } else {
      setPointsMarketingData(null);
    }
  }, [storefront]);

  useEffect(() => {
    if (pointsMarketingData) {
      const data: any = pointsMarketingData.map(
        (pointsData: PointsData, index) => {
          let currentReward = pointsData.wayToEarn;
          if (currentLocaleId && pointsData.locales?.length > 0) {
            currentReward =
              pointsData.locales.find(
                (item) => item.localeId === currentLocaleId
              )?.wayToEarn || currentReward;
          }
          const obj: any = {
            key: index,
            benefit: currentReward,
            points: pointsData.pointValue,
          };
          return obj;
        }
      ) as any;
      setTableData([...data] as any);
      const columns: any = [
        {
          title: "",
          dataIndex: "benefit",
          className: Styles["reward-text"],
          width: "90%",
        },
        {
          title: "",
          dataIndex: "points",
          className: Styles["reward-text"],
          width: "10%",
        },
      ];
      setTableColumns(columns);
    }
  }, [storefront, pointsMarketingData, currentLocaleId]);

  const scroll: { x?: number | string; y?: number | string } = {};

  return (
    <Section>
      {pointsMarketingData && (
        <div
          className={`${Styles["rewards-section"]}${
            isFaq
              ? ` ${Styles["rewards-section-from-faq"]} ${
                  template === JapaneseTemplateName
                    ? Styles["anime-rewards-section"]
                    : ""
                }`
              : ""
          }`}
        >
          <h2>
            {currentStorefrontLocale?.pointsTableHeaderText ||
              storefront?.pointsTableHeaderText}
          </h2>
          <ReactMarkdown>
            {currentStorefrontLocale?.pointsTableBodyText ||
              storefront?.pointsTableBodyText ||
              ""}
          </ReactMarkdown>
          <div className={Styles["mobile-scroll"]}>
            <Table
              columns={tableColumns}
              dataSource={tableData}
              scroll={scroll}
              className={Styles.table}
              pagination={false}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "even-row" : "odd-row"
              }
            />
          </div>
        </div>
      )}
    </Section>
  );
};
