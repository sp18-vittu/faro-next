import { useState, useEffect, useRef } from "react";
import { Select, Button } from "antd";
import { useTranslation } from "next-i18next";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";

import { useAppContext } from "@/context/appContext";
import { useCommercialPageStore } from "@/state/CommercialPage";

import styles from "./categoryFilter.module.scss";

interface ICategoryFilterProps {
  value: number | undefined;
  setFilterBy: (val: number) => void;
  view: "list" | "grid";
  onViewChange: (e: React.MouseEvent<HTMLElement>) => void;
}

const CategoryFilter = ({
  setFilterBy,
  value,
  view,
  onViewChange,
}: ICategoryFilterProps) => {
  const [filterOptions, setFilterOptions] = useState<
    { value: number | string; label: string }[]
  >([]);
  const ref = useRef<any>();
  const { categories } = useAppContext() as any;
  const benefitCategories = useCommercialPageStore(
    (state) => state.benefitCategories
  );
  const { t } = useTranslation("common");

  useEffect(() => {
    if (
      Object.keys(benefitCategories).length > 0 &&
      filterOptions?.length === 0
    ) {
      setFilterOptions(
        Object.keys(benefitCategories)
          .filter((el: any) => benefitCategories[el].length > 0)
          .map((el: any) => ({
            label: t(el.toUpperCase()),
            value: categories.find((catEl: any) => {
              return catEl.name.toLowerCase() === el.toLowerCase();
            })?.id,
          }))
      );
    }
  }, [benefitCategories]);

  return (
    <div
      className={`container ${styles["filter-wrapper"]}`}
      id="category-filter"
    >
      <div ref={ref}>
        <Select
          options={filterOptions}
          value={value}
          placeholder={t("SHOW_ALL")}
          onChange={(val) => {
            setFilterBy(val);
          }}
          allowClear
          getPopupContainer={() => ref.current}
        />
      </div>
      <Button
        type="link"
        icon={
          view === "list" ? <AppstoreOutlined /> : <UnorderedListOutlined />
        }
        onClick={onViewChange}
        className={styles["view-btn"]}
      >
        {`${view === "list" ? t("GRID") : t("LIST")} ${t("VIEW")}`}
      </Button>
    </div>
  );
};

export default CategoryFilter;
