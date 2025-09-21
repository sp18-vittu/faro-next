import Image from "next/image";
import Slider from "react-slick";
import dayjs from "dayjs";
import { trackEvent } from "fathom-client";

import { useCommercialPageStore } from "@/state/CommercialPage";
import { useStorefrontStore } from "@/state/StorefrontStore";
import CategoryList from "./categoryList";
import News from "./news";

import styles from "./heroSection.module.scss";

interface CommercialHeroSectionProps {
  setFilterBy: (val: number) => void;
  filterBy: number | undefined;
}

const CommercialHeroSection = ({
  setFilterBy,
  filterBy,
}: CommercialHeroSectionProps) => {
  const page = useCommercialPageStore((state) => state.page);
  const storefront = useStorefrontStore((state) => state.storefront);

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    (["Home"].includes(page) && (
      <>
        <div className={`container ${styles.container}`}>
          <div
            className={styles["slider-wrapper"]}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              const target = e.target as HTMLElement;
              if (
                target.tagName === "IMG" &&
                target.parentElement?.attributes?.hasOwnProperty("href")
              ) {
                trackEvent("Hero Image Clicked", { _value: 1 });
              }
            }}
          >
            <Slider {...settings} className={styles["hero-slider"]}>
              {storefront?.heroImages &&
                storefront?.heroImages
                  ?.filter((el) => {
                    if (el.status === "active") {
                      return true;
                    }
                    if (el.startDate && el.endDate) {
                      return (
                        dayjs().isAfter(dayjs(el.startDate)) &&
                        dayjs().isBefore(dayjs(el.endDate))
                      );
                    }
                  })
                  .map((el) => (
                    <div key={`benefitCardCarousel-${el.imageUrl}`}>
                      <a href={el.redirectUrl} target="_blank" rel="noreferrer">
                        <Image
                          src={el.imageUrl}
                          alt="HeroImage"
                          width={1200}
                          height={340}
                        />
                      </a>
                    </div>
                  ))}
            </Slider>
          </div>
          <CategoryList
            setFilterBy={setFilterBy}
            filterBy={filterBy}
            singleImage={storefront?.heroImages?.length === 1}
          />
        </div>
        <News singleImage={storefront?.heroImages?.length === 1} />
      </>
    )) || <></>
  );
};

export default CommercialHeroSection;
