import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { Spin } from "antd";
import { trackEvent } from "fathom-client";

import { useCommercialPageStore } from "@/state/CommercialPage";
import { useAppContext } from "@/context/appContext";
import { useStorefrontStore } from "@/state/StorefrontStore";

import styles from "./heroSection.module.scss";

interface ICategoryListProps {
  setFilterBy: (val: number) => void;
  filterBy: string | number | undefined;
  singleImage: boolean;
}

const CategoryList = ({
  setFilterBy,
  filterBy,
  singleImage,
}: ICategoryListProps) => {
  const [categoryList, setCategoryList] = useState<
    {
      title: string;
      href: string;
      key: string;
      id: number;
      img: string | undefined;
    }[]
  >([]);
  const [scrollTo, setScrollTo] = useState<string>(); //useRef instead of this
  const { t } = useTranslation("common");
  const { categories } = useAppContext() as any;

  const benefitCategories = useCommercialPageStore(
    (state) => state.benefitCategories
  );

  const storefront = useStorefrontStore((state) => state.storefront);

  const createCategoryList = () => {
    return Object.keys(benefitCategories)
      .filter((el: string) => benefitCategories[el]?.length > 0)
      .map((el: string) => {
        const id = categories.find(
          (innerEl: any) => innerEl.name.toLowerCase() === el.toLowerCase()
        )?.id;

        const img = storefront?.categoryImages?.find((el: any) => {
          return el.categoryId === id;
        })?.url;

        return {
          title: t(
            `${
              el === "digitalbook"
                ? "PDF"
                : el === "archive"
                ? "ARCHIVE_HEADING"
                : el.toUpperCase()
            }`
          ),
          href: `${el}-section`,
          key: el,
          replace: true,
          id: id,
          img: img,
        };
      });
  };
  useEffect(() => {
    if (
      Object.keys(benefitCategories).length > 0 &&
      categoryList.length === 0
    ) {
      setCategoryList(createCategoryList());
    }
  }, [benefitCategories]);

  // useEffect(() => {
  //   setCategoryList(createCategoryList());
  // }, [t]);

  useEffect(() => {
    if (filterBy && benefitCategories) {
      const ff = categoryList.find((el: any) => el.key === scrollTo)?.href;
      if (ff) {
        const section = document.getElementById(ff);
        if (section) {
          const sectionTop =
            section.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: sectionTop, behavior: "smooth" });
        }
      }
    }
  }, [benefitCategories]);

  const handleCategoryClick = (id: number, key: string) => {
    setFilterBy(id);
    setScrollTo(key);
    trackEvent(`${key} selected`, { _value: 1 });
  };

  return (
    <div
      className={`${styles["lottery-section"]} ${
        singleImage ? styles["single-image"] : ""
      }`}
    >
      {/* Refine the lottery */}
      {categoryList?.length === 0 ? (
        <Spin style={{ marginTop: 30 }} />
      ) : (
        <>
          {categoryList?.map((el) => {
            return el.img ? (
              <Image
                width={390}
                height={82}
                alt={el.title}
                src={el.img}
                onClick={() => {
                  handleCategoryClick(el.id, el.key);
                }}
                style={{ cursor: "pointer" }}
                className={styles["categoryImage"]}
              />
            ) : (
              <div
                key={el.key}
                className={styles["categoryDetails"]}
                onClick={() => {
                  handleCategoryClick(el.id, el.key);
                }}
              >
                {el.title}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default CategoryList;
