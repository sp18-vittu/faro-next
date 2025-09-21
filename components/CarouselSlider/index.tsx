import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { JapaneseTemplateName } from "@/constant";
import { useBenefitStore } from "@/state/BenefitState";
import { BenefitCard } from "../Benefits/BenefitCard";
import { Benefit, HeroImage } from "@/shared/types/types";

import styles from "./style.module.scss";

export const CarouselSlider = ({
  template,
  benefitList,
  sliderClassName,
  heroImages,
}: {
  template?: string;
  benefitList?: Benefit[];
  sliderClassName?: string;
  heroImages?: HeroImage[];
}) => {
  const benefits = useBenefitStore((state) => state.benefits);
  const slider = React.useRef<Slider | null>(null);
  const settings = {
    infinite: false,
    speed: 500,
    dots: false,
    slidesToShow:
      template === JapaneseTemplateName ? (benefits.length > 3 ? 3 : 2) : 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
    responsive:
      template !== JapaneseTemplateName
        ? [
            {
              breakpoint: 2560,
              settings: {
                slidesToShow: 6,
                infinite: false,
              },
            },
            {
              breakpoint: 1199,
              settings: {
                slidesToShow: 4,
                infinite: false,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 4,
                infinite: false,
              },
            },
            {
              breakpoint: 576,
              settings: {
                slidesToShow: 3,
                infinite: false,
                initialSlide: 0,
              },
            },
          ]
        : [
            {
              breakpoint: 1399,
              settings: {
                slidesToShow:
                  template === JapaneseTemplateName
                    ? benefits.length > 3
                      ? 3
                      : 2
                    : benefits.length > 4
                    ? 4
                    : 3,
                infinite: true,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                infinite: true,
              },
            },
            {
              breakpoint: 561,
              settings: {
                slidesToShow: 1,
                infinite: false,
              },
            },
          ],
  };
  return (
    <div
      className={`${styles["sliderContainer"]} ${
        template !== JapaneseTemplateName
          ? styles["commercial-sliderContainer"]
          : ""
      } `}
    >
      {/* <Button
        className={styles.buttonLeft}
        icon={
          template === JapaneseTemplateName ? (
            <LeftOutlined />
          ) : (
            <Image
              src={ForwardIcon}
              style={{ transform: "rotate(180deg)" }}
              alt="forward"
              height={38}
              width={38}
            />
          )
        }
        onClick={() => slider?.current?.slickPrev()}
      /> */}
      <Slider
        ref={slider}
        className={`${styles.slider} ${sliderClassName || ""}`}
        {...settings}
      >
        {benefits &&
          template === JapaneseTemplateName &&
          benefits.map((benefit, id) => {
            return (
              <>
                <div
                  className={`${styles["card-wrapper"]} ${
                    template === JapaneseTemplateName
                      ? styles["jap-card-wrapper"]
                      : ""
                  } ${
                    benefit.showImagesOnly ? styles["image-only-wrapper"] : ""
                  }`}
                >
                  <BenefitCard
                    key={`benefitCardCarousel-${id}`}
                    benefit={benefit}
                    id={id}
                    border={false}
                    size="sm"
                    template={template}
                    isSlider
                  />
                </div>
              </>
            );
          })}

        {template !== JapaneseTemplateName &&
          benefitList &&
          benefitList.map((benefit) => {
            return (
              <>
                <div className={`${styles["card-wrapper"]}`}>
                  <BenefitCard
                    key={`benefitCardCarousel-${benefit.id}`}
                    benefit={benefit}
                    id={benefit.id}
                    template={template}
                  />
                </div>
              </>
            );
          })}
      </Slider>
      {/* <Button
        className={styles.buttonRight}
        icon={
          template === JapaneseTemplateName ? (
            <RightOutlined />
          ) : (
            // null
            <Image src={ForwardIcon} alt="forward" height={38} width={38} />
          )
        }
        onClick={() => slider?.current?.slickNext()}
      /> */}
    </div>
  );
};
