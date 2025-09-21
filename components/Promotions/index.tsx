import React, { useEffect, useState } from "react";
import { 
  UserStreak,
  PointRewardsForUserStreak,
  PointRelation,
  PointReward,
} from "@/shared/types/types";
import { getUserStreak } from "./apiUtils";
import Micons from "@/components/customAntd/micons";
import Section from "../Section";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Styles from "./style.module.scss";
import { usePassStore } from "@/state/PassState";
import {
  CloseCircleTwoTone,
  CheckCircleTwoTone
} from "@ant-design/icons";

export const Promotions = () => {
	const { t } = useTranslation("common");
  const passData = usePassStore((state) => state.passData);
  const [pointRewards, setPointRewards] = useState<PointRewardsForUserStreak[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const getActionString = (actionString: string) => {
    switch (actionString) {
      case 'visit':
        return 'visiting';
      case 'view':
        return 'watching';
      case 'listen':
        return 'listening';
      case 'read':
        return 'reading';
      case 'purchase':
        return 'purchasing';
      default:
        return actionString;
    }
  }

  useEffect(() => {
    if (passData && passData?.id > 0) {
      (async () => {
        setIsLoading(true);
        setIsError(false);
        const response = await getUserStreak(passData.passId); 
        if (response.status === 200) {
          const pointRewards = response?.data?.pointRewards as PointRewardsForUserStreak[];
          pointRewards?.forEach(reward => {
            reward.pointRelations?.forEach(relation => relation.userStreak = relation.userStreak?.sort(dynamicSort("-id")));
          })          
          setPointRewards(response?.data?.pointRewards as PointRewardsForUserStreak[]);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setIsError(true);
        }
      })();
    }
  }, [passData]);

  const scroll: { x?: number | string; y?: number | string } = {};

  const dynamicSort = (property: any) => {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return (a: any, b: any) => {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

  const renderVisitPod = (reward: PointRewardsForUserStreak) => (
    <div className={Styles["card"]}>
      <h2>{reward.name}</h2>
      <p>{`You can earn ${reward.pointReward} points by 
          ${getActionString(reward.actionType)} ${reward.streakCount} ${reward.streakFrequency}(s) in a row.`}
          {reward.startDate && (
            <><br />
            {` between ${reward.startDate} and ${reward.endDate}`} 
            </>
          )}
      </p>
      <br />
      {reward.pointRelations?.map(relation => (
        <>
          <div className={Styles["merchantImageContainer"]}>
            <Image
              className={Styles["merchantImage"]}
              fill={true}
              src={(relation.merchant?.logoUrl) ?? "/images/logo.png"}
              alt="merchant image" />
          </div>
          <div className={Styles["merchantDetails"]}>
              <p className={Styles["title"]}>{relation.merchant?.name}</p>
          </div>
          <div className={Styles["progressContainer"]}>
            {Array.from({length: reward.streakCount || 0}).map((_item, index) => {
              if (relation.userStreak && relation.userStreak[0]?.streakNumber >= index) {
                return <CheckCircleTwoTone twoToneColor={"#c372ef"} style={{ fontSize: '300%'}}  key={index} /> 
              } else {
                return <CloseCircleTwoTone twoToneColor={"#c372ef"} style={{ fontSize: '300%'}}  key={index} /> 
              }
            })}   
          </div>
        </>
      ))}
    </div>
  );

  const renderViewPod = (reward: PointRewardsForUserStreak) => (
    <div className={Styles["card"]}>
      <h2>{reward.name}</h2>
      <p>{`You can earn ${reward.pointReward} points by 
          ${getActionString(reward.actionType)} ${reward.streakCount} ${reward.streakFrequency}(s) in a row.`}
          {reward.startDate && (
            <><br />
            {` between ${reward.startDate} and ${reward.endDate}`} 
            </>
          )}
      </p>
      <br />
      {reward.pointRelations?.map(relation => (
        <>
          <div className={Styles["merchantImageContainer"]}>
            <Image
              className={Styles["merchantImage"]}
              fill={true}
              src={relation.benefit?.previewResourceUrl ||  "/images/logo.png"}
              alt="merchant image" />
          </div>
          <div className={Styles["merchantDetails"]}>
              <p className={Styles["title"]}>{relation.benefit?.title}</p>
              <p className={Styles["rewardText"]}>{relation.benefit?.description}</p>
          </div>
          <div className={Styles["progressContainer"]}>
            {Array.from({length: reward.streakCount || 0}).map((_item, index) => {
              if (relation.userStreak && relation.userStreak[0]?.streakNumber >= index) {
                return <CheckCircleTwoTone twoToneColor={"#c372ef"} style={{ fontSize: '300%'}}  key={index} /> 
              } else {
                return <CloseCircleTwoTone twoToneColor={"#c372ef"} style={{ fontSize: '300%'}}  key={index} /> 
              }
            })}  
          </div>
        </>
      ))}     
    </div>
  );

  return (
    <Section>
      <div className={Styles["rewards-section"]}>
      {isLoading ? (
        <p className={Styles.loading}>{t("PASS_LOADING")}...</p>
      ) : isError ? (
        <p className={Styles.loading}>
          {t("ERROR_OCCURED")}
        </p>
      ) : (
        <>
        {pointRewards?.length > 0 && (
          pointRewards.map(currentReward => (
            (currentReward.actionType === 'visit' && renderVisitPod(currentReward))
          ))
        )}
        {pointRewards?.length > 0 && (
          pointRewards.map(currentReward => (
            ((currentReward.actionType === 'view' || 
            currentReward.actionType === 'listen' || 
            currentReward.actionType === 'read')
             && renderViewPod(currentReward))
          ))
        )}
        </>
      )}
      </div>
    </Section>
  );
};
