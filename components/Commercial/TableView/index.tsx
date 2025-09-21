import { useMemo, useState, useRef } from "react";
import { Button, Table, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "next-i18next";
import dayjs from "dayjs";

import { Benefit } from "@/shared/types/types";
import { useBenefitStore } from "@/state/BenefitState";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";
import { useBenefitModalStore } from "@/state/BenefitModalStore";

import styles from "./tableView.module.scss";

interface ITableViewProps {
  allSweepstakes: Benefit[];
  // filterBy: number | undefined;
  // setFilterBy: (val: number) => void;
  loading: boolean;
}

const TableView = ({
  allSweepstakes,
  // setFilterBy,
  // filterBy,
  loading,
}: ITableViewProps) => {
  const [pagination, setPagination] = useState<{
    page: number;
    pageSize: number;
  }>({ page: 1, pageSize: 10 });
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const setCurrentBenefit = useBenefitStore((state) => state.setCurrentBenefit);
  const toggleBenefitModal = useBenefitModalStore((state) => state.setVisible);

  const currentLocaleId = useSelectedLocaleStore(
    (state) => state.currentLocaleId
  );

  const { t } = useTranslation("common");

  const getStatus = (benefit: Benefit) => {
    const startDate = benefit.startDate;
    const endDate = benefit.endDate;
    const resultAnnouncementDate = benefit?.sweepStake?.resultAnnouncementDate;

    if (dayjs().isAfter(dayjs(startDate)) && dayjs().isBefore(dayjs(endDate))) {
      //Accepting applications for lottery
      if (dayjs().isAfter(dayjs(endDate).subtract(3, "days"))) {
        //Registration has less than three days left
        // return "Deadline Approaching";
        return t("DEADLINE_APPROACHING");
      }
      return t("REGISTRATIONS_OPEN");
    } else if (
      dayjs().isAfter(dayjs(endDate)) &&
      dayjs().isBefore(dayjs(resultAnnouncementDate))
    ) {
      return t("REGISTRATIONS_CLOSED");
    } else if (dayjs().isAfter(dayjs(resultAnnouncementDate))) {
      return t("RESULTS_ANNOUNCED");
    } else {
      return "";
    }
    // Need to return color for the text as well
  };

  const columns: ColumnsType<Benefit> = useMemo(
    () => [
      {
        title: t("S.NO"),
        width: 70,
        render: (_, __, index: number) => (
          <span>
            {(pagination?.page - 1) * pagination.pageSize + index + 1}
          </span>
        ),
        align: "center",
      },
      {
        title: t("EVENT_NAME"),
        key: "title",
        dataIndex: "title",
        render: (_, record) => {
          const findLocale = record.locales.filter(
            (item) => item.localeId === currentLocaleId
          )[0];

          return <span>{findLocale?.title || record.title}</span>;
        },
        width: 145,
      },
      {
        title: t("CATEGORY"),
        key: "category",
        dataIndex: "category",
        render: (_, record) => (
          <span>{t(record?.category?.name?.toUpperCase() || "")}</span>
        ),
        width: 145,
      },
      {
        title: t("REGISTRATION_END_DATE"),
        key: "endDate",
        dataIndex: "endDate",
        render: (_, record) => (
          <span>{dayjs(record.endDate).format("MM/DD/YYYY")}</span>
        ),
        width: 175,
      },
      {
        title: t("RESULT_ANNOUNCEMENT_DATE"),
        key: "sweepstake",
        dataIndex: "sweepstake",
        render: (_, record) => (
          <span>
            {`${
              record?.sweepStake
                ? dayjs(record.sweepStake.resultAnnouncementDate).format(
                    "MM/DD/YYYY"
                  )
                : "--"
            }`}
          </span>
        ),
        width: 175,
      },
      {
        title: `${t("PARTICIPANTS")}/${t("WINNER")} ${t("COUNT")}`,
        key: "count",
        render: (_, record) => {
          return (
            <span>
              {record?.category?.name === "Archive"
                ? record?.sweepStake?.rewardCount
                : record?._count?.sweepStakesRegistrations}
            </span>
          );
        },
        width: 175,
      },
      {
        title: t("STATUS"),
        key: "status",
        render: (_, record) => <span>{getStatus(record)}</span>,
        width: 150,
      },
      {
        title: "",
        key: "",
        render: (_, record) =>
          [t("DEADLINE_APPROACHING"), t("REGISTRATIONS_OPEN")].includes(
            getStatus(record)
          ) && (
            <Button
              className={styles["lottery-button"]}
              onClick={() => {
                setCurrentBenefit(record);
                toggleBenefitModal();
              }}
            >
              {t("LOTTERY")}
            </Button>
          ),
        width: 100,
        fixed: "right",
        align: "center",
      },
    ],
    [pagination, t]
  );

  return loading ? (
    <div className="container">
      <Spin size="small" style={{ margin: "30px auto" }} />
    </div>
  ) : (
    <div
      className={`container ${styles["table-wrapper"]}`}
      ref={tableWrapperRef}
    >
      <Table
        columns={columns}
        dataSource={allSweepstakes}
        style={{ padding: 0 }}
        pagination={{
          onChange: (page, pageSize) => setPagination({ page, pageSize }),
          showSizeChanger: false,
        }}
        scroll={{ x: tableWrapperRef.current?.clientWidth || 0 }}
      />
    </div>
  );
};

export default TableView;
