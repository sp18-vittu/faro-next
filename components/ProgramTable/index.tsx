import React, { useEffect, useState } from "react";
import { Table } from "antd";
import ReactMarkdown from "react-markdown";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";

import {
  Tier,
  Storefront,
  MarketingData,
  MarketingDataLocale,
  StorefrontMarketing,
} from "@/shared/types/types";
import { JapaneseTemplateName } from "@/constant";
import Micons from "@/components/customAntd/micons";
import Section from "../Section";

import Styles from "./style.module.scss";

export const ProgramTable = ({
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
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (storefront) {
      const tiers: Tier[] = storefront
        ? storefront.marketingData.reduce(
            (tiers: Tier[], reward: MarketingData) => {
              for (let curTier of reward.tiers) {
                if (!tiers.find((tier) => tier.id === curTier.tierId)) {
                  tiers.push(curTier.tier);
                }
              }
              return tiers;
            },
            []
          )
        : [];
      setTiers(
        tiers.sort((a, b) => {
          if (a.pointThreshold < b.pointThreshold) {
            return -1;
          }
          if (a.pointThreshold > b.pointThreshold) {
            return 1;
          }
          return 0;
        })
      );
    }
  }, [storefront]);

  const getTierName = (tier: Tier) => {
    if (currentLocaleId && tier?.locales?.length > 0) {
      return (
        tier.locales.find((item) => item.localeId === currentLocaleId)?.name ||
        tier.name
      );
    }
    return tier.name;
  };

  useEffect(() => {
    if (tiers) {
      const colWidth = `${50 / tiers.length}%`;
      const columns: any = [
        {
          title: "",
          dataIndex: "benefit",
          className: Styles["reward-text"],
          width: "50%",
        },
        ...tiers.map((tier, index) => {
          let prevPointThreshold =
            index > 0 ? tiers[index - 1].pointThreshold : "0";
          return {
            title: (
              <>
                <h3>{getTierName(tier)}</h3>
                {tier.pointThreshold !== null && index < tiers.length - 1 && (
                  <p>
                    {tier.pointThreshold.toLocaleString()}-
                    {tiers[index + 1].pointThreshold.toLocaleString()} PTS
                  </p>
                )}
                {tier.pointThreshold !== null && index === tiers.length - 1 && (
                  <p>{tier.pointThreshold.toLocaleString()}+ PTS</p>
                )}
              </>
            ),
            dataIndex: `name${index}`,
            align: "center",
            width: colWidth,
          };
        }),
      ];
      setTableColumns(columns);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiers, currentLocaleId]);

  useEffect(() => {
    if (storefront) {
      const data: any = storefront?.marketingData.map((reward, index) => {
        let currentReward = reward?.reward;
        if (currentLocaleId && reward?.locales?.length > 0) {
          currentReward =
            reward.locales.find((item) => item.localeId === currentLocaleId)
              ?.reward || currentReward;
        }
        const obj: any = { key: index, benefit: currentReward };
        tiers.forEach((tier, indexInner) => {
          obj[`name${indexInner}`] = (
            <Micons
              type="filled"
              icon={
                reward?.tiers?.find(
                  (rewardTier) => rewardTier.tierId === tier.id
                )
                  ? "check_circle"
                  : ""
              }
              isHover={false}
              style={{
                fontSize: 30,
                margin: "0 auto",
                width: "max-content",
              }}
            />
          );
        });
        return obj;
      }) as any;
      setTableData([...data] as any);
    }
  }, [storefront, tiers, currentLocaleId]);

  const scroll: { x?: number | string; y?: number | string } = {};

  return (
    <Section>
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
        <h2>{currentStorefrontLocale?.headerText || storefront?.headerText}</h2>
        <ReactMarkdown>
          {currentStorefrontLocale?.bodyText || storefront?.bodyText || ""}
        </ReactMarkdown>
        {tiers && (
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
        )}
      </div>
    </Section>
  );
};
