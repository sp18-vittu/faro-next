// ThemeManager.js
import React, { useEffect } from "react";
import { useThemeStore } from "@/state/ThemeDetailsStore";

const ThemeManager = ({
  buttonPrimaryColor = "#313fae",
  loginButtonsPrimaryColor = "#000",
  benefitModalButtonPrimaryColor = "#45319d",
  benefitModalButtonPrimaryColorDisabled = "#4555cdb6",
  benefitModalButtonSecondaryColor = "#c372ef",
  benefitModalCouponBackground = "#313fae",
  benefitModalTitleColor = "#313fae",
  benefitModalDisclaimerBackgroundColor = "#f4f4f4",
  benefitModalTitleFontFamily = "Kozuka-Gothic-Heavy",
  benefitModalDescriptionFontFamily = "Kozuka-Gothic-Heavy",
  benefitModalTitleFontSize = "30px",
  benefitModalDescriptionFontSize = "14px",
  benefitModalDescriptionTextColor = "#565656",
  benefitModalButtonTextColor = "#fff",
  benefitModalCouponFontFamily = "Kozuka-Gothic-Heavy",
  benefitModalCouponDiscountFontSize = "16px",
  benefitModalCouponExpiryFontSize = "13px",
  loginButtonsFontFamily = "Kozuka-Gothic-Heavy",
  loginButtonsFontSize = "12px",
  loginButtonsFontSizeSmall = "12px",
  benefitModalDisclaimerTitleFontSize = "14px",
  benefitModalDisclaimerContentFontSize = "14px",
  benefitModalMerchantContainerBorderColor = "#313fae",
  benefitModalMerchantContainerBackgroundColor = "#fff",
  benefitModalMerchantContainerFontFamily = "Kozuka-Gothic-Heavy",
  benefitModalMerchantContainerButtonColor = "#313fae",
  footerHeaderFontFamily = "Kozuka-Gothic-Heavy",
  footerHeaderFontSize = "26px",
  footerHeaderFontColor = "#fff",
  footerDescriptionFontFamily = "Kozuka-Gothic-Heavy",
  footerDescriptionFontSize = "16px",
  footerDescriptionFontColor = "#fff",
  footerCopyrightFontFamily = "Inter, sans-serif",
  footerCopyrightFontSize = "16px",
  footerCopyrightFontColor = "#fff",
  footerBackgroundColor = "#000",
  categoryHeadingFontFamily = "Integral CF",
  categoryHeadingFontSize = "24px",
  categoryHeadingFontColor = "#222124",
  categorySeeAllFontFamily = "Manrope, sans-serif",
  categorySeeAllFontSize = "20px",
  categorySeeAllFontColor = "#3200c3",
  benefitCardTitleFontFamily = "Kozuka-Gothic-Heavy",
  benefitCardTitleFontSize = "16px",
  benefitCardTitleFontColor = "#00468c",
  benefitCardDescriptionFontFamily = "Inter, sans-serif",
  benefitCardDescriptionFontSize = "14px",
  benefitCardDescriptionFontColor = "#222124",
  userDetailsFontFamily = "Manrope, sans-serif",
  userDetailsFontSize = "14px",
  benefitsHeadingFontFamily = "Kozuka-Gothic-Heavy",
  benefitsHeadingFontSize = "22px",
  benefitsHeadingFontColor = "#fff",
  formLabelsFontFamily = "Inter, sans-serif",
  formLabelFontColor = "#000000",
  newsNotificationFontFamily = "Manrope, sans-serif",
  newsNotificationTitleFontColor = "#222124",
  newsNotificationTimeStampFontColor = "#636363",
  newsNotificationMessageFontColor = "#1a1f36",
  newsNotificationActiveTabBackgroundColor = "rgba(128, 43, 225, 0.05)",
  benefitCardShortDescriptionFontColor = "#ff4d4d",
}: any) => {
  const themeDetails = useThemeStore((state) => state.themeDetails);

  useEffect(() => {
    // Update CSS variables dynamically
    document.documentElement.style.setProperty(
      "--button-primary-color",
      buttonPrimaryColor
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-button-primary-color",
      benefitModalButtonPrimaryColor
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-button-primary-color-disabled",
      benefitModalButtonPrimaryColorDisabled
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-button-secondary-color",
      benefitModalButtonSecondaryColor
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-coupon-background",
      benefitModalCouponBackground
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-title-color",
      benefitModalTitleColor
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-disclaimer-background-color",
      benefitModalDisclaimerBackgroundColor
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-title-font-family",
      benefitModalTitleFontFamily
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-description-font-family",
      benefitModalDescriptionFontFamily
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-title-font-size",
      benefitModalTitleFontSize
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-description-font-size",
      benefitModalDescriptionFontSize
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-description-text-color",
      benefitModalDescriptionTextColor
    );
    document.documentElement.style.setProperty(
      "--Login-buttons-font-family",
      loginButtonsFontFamily
    );
    document.documentElement.style.setProperty(
      "--Login-buttons-font-size",
      loginButtonsFontSize
    );
    document.documentElement.style.setProperty(
      "--Login-buttons-font-size-small",
      loginButtonsFontSizeSmall
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-button-text-color",
      benefitModalButtonTextColor
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-coupon-discount-font-size",
      benefitModalCouponDiscountFontSize
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-coupon-font-family",
      benefitModalCouponFontFamily
    );

    document.documentElement.style.setProperty(
      "--benefit-modal-coupon-expiry-font-size",
      benefitModalCouponExpiryFontSize
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-disclaimer-title-font-size",
      benefitModalDisclaimerTitleFontSize
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-disclaimer-content-font-size",
      benefitModalDisclaimerContentFontSize
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-merchant-container-border-color",
      benefitModalMerchantContainerBorderColor
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-merchant-container-background-color",
      benefitModalMerchantContainerBackgroundColor
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-merchant-container-font-family",
      benefitModalMerchantContainerFontFamily
    );
    document.documentElement.style.setProperty(
      "--benefit-modal-merchant-container-button-color",
      benefitModalMerchantContainerButtonColor
    );
    document.documentElement.style.setProperty(
      "--Login-buttons-primary-color",
      loginButtonsPrimaryColor
    );
    document.documentElement.style.setProperty(
      "--footer-header-font-family",
      footerHeaderFontFamily
    );
    document.documentElement.style.setProperty(
      "--footer-header-font-size",
      footerHeaderFontSize
    );
    document.documentElement.style.setProperty(
      "--footer-header-font-color",
      footerHeaderFontColor
    );
    document.documentElement.style.setProperty(
      "--footer-description-font-family",
      footerDescriptionFontFamily
    );
    document.documentElement.style.setProperty(
      "--footer-description-font-size",
      footerDescriptionFontSize
    );
    document.documentElement.style.setProperty(
      "--footer-description-font-color",
      footerDescriptionFontColor
    );
    document.documentElement.style.setProperty(
      "--footer-copyright-font-family",
      footerCopyrightFontFamily
    );
    document.documentElement.style.setProperty(
      "--footer-copyright-font-size",
      footerCopyrightFontSize
    );
    document.documentElement.style.setProperty(
      "--footer-copyright-font-color",
      footerCopyrightFontColor
    );
    document.documentElement.style.setProperty(
      "--footer-background-color",
      footerBackgroundColor
    );
    document.documentElement.style.setProperty(
      "--category-heading-font-family",
      categoryHeadingFontFamily
    );
    document.documentElement.style.setProperty(
      "--category-heading-font-size",
      categoryHeadingFontSize
    );
    document.documentElement.style.setProperty(
      "--category-heading-font-color",
      categoryHeadingFontColor
    );
    document.documentElement.style.setProperty(
      "--category-see-all-font-family",
      categorySeeAllFontFamily
    );
    document.documentElement.style.setProperty(
      "--category-see-all-font-size",
      categorySeeAllFontSize
    );
    document.documentElement.style.setProperty(
      "--category-see-all-font-color",
      categorySeeAllFontColor
    );
    document.documentElement.style.setProperty(
      "--benefit-card-title-font-family",
      benefitCardTitleFontFamily
    );
    document.documentElement.style.setProperty(
      "--benefit-card-title-font-size",
      benefitCardTitleFontSize
    );
    document.documentElement.style.setProperty(
      "--benefit-card-title-font-color",
      benefitCardTitleFontColor
    );
    document.documentElement.style.setProperty(
      "--benefit-card-description-font-family",
      benefitCardDescriptionFontFamily
    );
    document.documentElement.style.setProperty(
      "--benefit-card-description-font-size",
      benefitCardDescriptionFontSize
    );
    document.documentElement.style.setProperty(
      "--benefit-card-description-font-color",
      benefitCardDescriptionFontColor
    );
    document.documentElement.style.setProperty(
      "--user-details-font-family",
      userDetailsFontFamily
    );
    document.documentElement.style.setProperty(
      "--user-details-font-size",
      userDetailsFontSize
    );
    document.documentElement.style.setProperty(
      "--benefits-heading-font-family",
      benefitsHeadingFontFamily
    );
    document.documentElement.style.setProperty(
      "--benefits-heading-font-size",
      benefitsHeadingFontSize
    );
    document.documentElement.style.setProperty(
      "--benefits-heading-font-color",
      benefitsHeadingFontColor
    );
    document.documentElement.style.setProperty(
      "--form-labels-font-family",
      formLabelsFontFamily
    );
    document.documentElement.style.setProperty(
      "--form-label-font-color",
      formLabelFontColor
    );
    document.documentElement.style.setProperty(
      "--news-notification-font-family",
      newsNotificationFontFamily
    );
    document.documentElement.style.setProperty(
      "--news-notification-title-font-color",
      newsNotificationTitleFontColor
    );
    document.documentElement.style.setProperty(
      "--news-notification-time-stamp-font-color",
      newsNotificationTimeStampFontColor
    );
    document.documentElement.style.setProperty(
      "--news-notification-message-font-color",
      newsNotificationMessageFontColor
    );
    document.documentElement.style.setProperty(
      "--news-notification-active-tab-background-color",
      newsNotificationActiveTabBackgroundColor
    );
    document.documentElement.style.setProperty(
      "--benefit-card-short-description-font-color",
      benefitCardShortDescriptionFontColor
    );
  }, [themeDetails]);

  return null;
};

export default ThemeManager;
