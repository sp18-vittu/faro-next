import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Spin,
} from "antd";
import { useTranslation } from "react-i18next";
import { Benefit } from "@/shared/types/types";
import Image from "next/image";

import { getFeedback, submitFeedback } from "@/utils/commonApiUtils";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { useSelectedLocaleStore } from "@/state/SelectedLocale";
import { JapaneseTemplateName } from "@/constant";

import Styles from "./style.module.scss";

interface SurveyBenefitPropType {
  benefit: Benefit;
}

const SurveyBenefit = ({ benefit }: SurveyBenefitPropType) => {
  const currentLocaleId = useSelectedLocaleStore(
    (state) => state.currentLocaleId
  );
  const storefront = useStorefrontStore((state) => state.storefront);
  const [answers, setAnswers] = useState<Array<any>>([]);
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation("common");

  // Check if Feedback form is already submit by using GET API.
  useEffect(() => {
    (async () => {
      setIsPageLoading(true);
      const response = await getFeedback({
        storeFrontId: storefront?.title,
        benefitId: benefit?.id,
      });
      if (response?.status === 200) {
        setFeedbacks(response.data);
      }
      setIsPageLoading(false);
    })();
  }, []);

  const checkValidation = () => {
    const stepIndex = step - 1;
    const checkIfIndexIsArray = Array.isArray(answers[stepIndex]);
    if (
      !answers[stepIndex] ||
      (checkIfIndexIsArray && answers[stepIndex].length === 0)
    ) {
      setError(`${t("SELECT_VALUE")}`);
      return false;
    }
    setError("");
    return true;
  };

  useEffect(() => {
    if (answers.length !== 0) {
      checkValidation();
    }
  }, [answers]);

  const handleNextClick = () => {
    if (checkValidation()) {
      if (step !== benefit?.surveyQuestions.length) {
        setStep(step + 1);
      }
    }
  };

  const handleChange = (value: string) => {
    const tempArray = [...answers];
    tempArray[step - 1] = value;
    setAnswers(tempArray);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const data = {
      storeFrontId: storefront?.title,
      benefitId: benefit?.id,
      data: answers.map((item, index) => {
        return {
          surveyQuestionId: benefit?.surveyQuestions[index]?.id,
          localeId: currentLocaleId,
          selectedOptions: Array.isArray(item) ? [...item] : [item],
        };
      }),
    };
    const response = await submitFeedback(data);
    if (response.status === 200) {
      setIsSubmitted(true);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isPageLoading ? (
        <div className={Styles["loading"]}>
          <Spin />
        </div>
      ) : (
        <>
          {feedbacks && feedbacks?.length !== 0 ? (
            <h3
              className={`${Styles["success-message"]} ${
                storefront?.themeId !== JapaneseTemplateName
                  ? Styles["commercial"]
                  : ""
              }`}
            >
              {t("ALREADY_PARTICIPATED")}
            </h3>
          ) : (
            <>
              {isSubmitted ? (
                <h3
                  className={`${Styles["success-message"]} ${
                    storefront?.themeId !== JapaneseTemplateName
                      ? Styles["commercial"]
                      : ""
                  }`}
                >
                  {t("THANKS_FOR_FEEDBACK")}
                </h3>
              ) : (
                <>
                  <Row gutter={30}>
                    <Col xs={24} sm={6}>
                      <div className={Styles["banner-image"]}>
                        <Image
                          src={benefit?.previewResourceUrl as any}
                          alt=""
                          fill
                        />
                      </div>
                    </Col>
                    <Col xs={24} sm={18} className={Styles["benefit-col"]}>
                      <>
                        <div className={`${Styles["survey-wrapper"]}`}>
                          {benefit?.surveyQuestions.length &&
                            benefit?.surveyQuestions.map(
                              (item: any, index: number) => {
                                const findLocale = item.locales.filter(
                                  (local: any) =>
                                    local.localeId === currentLocaleId
                                )[0];
                                return (
                                  <div key={item.id}>
                                    {index + 1 === step && (
                                      <>
                                        <p className={Styles["question"]}>
                                          {findLocale?.question ||
                                            item.question}
                                        </p>
                                        {item.answerType === "SingleSelect" && (
                                          <Select
                                            style={{ width: "100%" }}
                                            placeholder="Select option"
                                            allowClear
                                            value={answers[index]}
                                            onChange={handleChange}
                                            options={(
                                              findLocale || item
                                            ).options.map((option: any) => {
                                              return {
                                                label: option,
                                                value: option,
                                              };
                                            })}
                                          />
                                        )}
                                        {item.answerType === "MultiSelect" && (
                                          <Select
                                            mode="multiple"
                                            style={{ width: "100%" }}
                                            placeholder={t("SELECT_OPTION")}
                                            allowClear
                                            onChange={handleChange}
                                            value={answers[index]}
                                            options={(
                                              findLocale || item
                                            ).options.map((option: any) => {
                                              return {
                                                label: option,
                                                value: option,
                                              };
                                            })}
                                          />
                                        )}
                                        {item.answerType === "Checkbox" && (
                                          <Checkbox.Group
                                            onChange={(value: any) =>
                                              handleChange(value)
                                            }
                                            value={answers[index]}
                                            options={(
                                              findLocale || item
                                            ).options.map((option: any) => {
                                              return {
                                                label: option,
                                                value: option,
                                              };
                                            })}
                                          />
                                        )}
                                        {item.answerType === "Radio" && (
                                          <Radio.Group
                                            onChange={(e: any) =>
                                              handleChange(e.target.value)
                                            }
                                            value={answers[index]}
                                            options={(
                                              findLocale || item
                                            ).options.map((option: any) => {
                                              return {
                                                label: option,
                                                value: option,
                                              };
                                            })}
                                          />
                                        )}
                                      </>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          {error && <p className={Styles["error"]}>{error}</p>}
                        </div>
                        <div
                          className={`${Styles["action-wrapper"]} ${
                            storefront?.themeId !== JapaneseTemplateName
                              ? Styles["commercial"]
                              : ""
                          }`}
                        >
                          <div>
                            {step > 1 && (
                              <Button
                                onClick={() => {
                                  setStep(step - 1);
                                  setError("");
                                }}
                                disabled={isLoading}
                              >
                                {t("PREV")}
                              </Button>
                            )}
                          </div>
                          <div>
                            <span>
                              {step}/{benefit?.surveyQuestions.length}
                            </span>
                            {step === benefit?.surveyQuestions.length ? (
                              <Button
                                type="primary"
                                onClick={handleSubmit}
                                loading={isLoading}
                              >
                                {t("SUBMIT")}
                              </Button>
                            ) : (
                              <Button type="primary" onClick={handleNextClick}>
                                {t("NEXT")}
                              </Button>
                            )}
                          </div>
                        </div>
                      </>
                    </Col>
                  </Row>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default SurveyBenefit;
