import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { lato } from "@/styles/fonts/fonts";
import { usePosition } from "./hooks";
import { useBenefitStore } from "@/state/BenefitState";
import { usePassStore } from "@/state/PassState";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { useModalStore } from "@/state/ModalStore";
import { Merchant, PointRelation, PointReward, PointRecord, PassData } from "@/shared/types/types";
import { earnPoints } from "@/utils/commonApiUtils";

import styles from "./style.module.scss";
import { getStoreFrontDetailsFromClient } from "@/utils/homePageApiUtils";
import { getPass } from "../../apiUtils";

type Position = {
    latitude: number;
    longitude: number;
};

export const CheckIn = () => {
    const { t } = useTranslation("common");
    const [position, error, loading] = usePosition()
    const program = useBenefitStore((state) => state.programDetails)
    const passData = usePassStore((state) => state.passData)
    const [currentMerchants, setCurrentMerchants] = useState<Merchant[]>([])
    const [validCheckInRewardRelations, setValidCheckInRewardRelations] = useState<PointRelation[]>([])
    const [earnLoading, setEarnLoading] = useState(false)
    const setBenefits = useBenefitStore((state) => state.setBenefits);
    const setStorefront = useStorefrontStore((state) => state.setStorefront);
    const storefront = useStorefrontStore((state) => state.storefront);
	const closeModal = useModalStore((state) => state.setClaimModalNotVisible);
    const setPassData = usePassStore((state) => state.setPassData);
    const setPointsTotal = usePassStore((state) => state.setPointsTotal);

    const visitPointRewards: PointReward[] = program.pointRewards.filter(r => r.actionType === 'visit')
    useEffect(() => {
        if (passData) {
            const { currentMerchants, validCheckInRewardRelations } = getCurrentMerchantsAndValidCheckinRewards(visitPointRewards, passData)
            setCurrentMerchants(currentMerchants)
            setValidCheckInRewardRelations(validCheckInRewardRelations)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position])


    const checkIn =  () => {
        setEarnLoading(true)
        earnPoints(validCheckInRewardRelations.map(relation => relation.id), passData?.passId).then(async res => {
            if (res.status === 200) {
                const { connectedPass, earnedPointsRecords } = res.data
                if (earnedPointsRecords.length === 0) {
                    message.info(
                        `${t("ALREADY_EARNED")}`,
                        3,
                        closeModal)
                }
                const totalEarnedPoints = earnedPointsRecords.reduce((sum: number, record: PointRecord) => sum + record.earnedPoints, 0)
                if (totalEarnedPoints > 0) {
                    message.success(
                        `${t("CONGRATULATIONS_YOU'VE_EARNED_POINTS")} ${t("POINTS_EARNED")}: ${totalEarnedPoints} ${t("TOTAL_POINTS")}: ${connectedPass.pointsTotal}`,
                        3,
                        closeModal)
                }
                if (connectedPass.tierId !== passData?.tierId) {
                    //User has been promoted to new tier
                    // so we need to refresh the benefits 
                    const {
                        benefits,
                        storefront: newStorefront,
                        program,
                    } = await getStoreFrontDetailsFromClient(storefront?.title);
                    setBenefits(benefits);
                    setStorefront(newStorefront);
                    const response = await getPass(storefront?.title);
                    if (response.status === 200) {
                        setPassData(response.data as PassData);
                        setPointsTotal((response.data as PassData).pointsTotal);
                    }
                } else {
                    setPointsTotal(connectedPass.pointsTotal);
                }
                
            } else{
                message.error(t("CHECK_IN_FAILED"))
                setEarnLoading(false)
            }
            return true;
           
        }).catch(err => {
            message.error(t("CHECK_IN_FAILED"))
            console.log("Error: ", err)
            setEarnLoading(false)
        })
    }

    const getCurrentMerchantsAndValidCheckinRewards = (visitPointRewards: PointReward[], passData: PassData) => {
        let currentMerchants: (Merchant)[] = []
        let validCheckInRewardRelations: PointRelation[] = []
        if (!position) {
            return { currentMerchants, validCheckInRewardRelations }
        }
        for (let visitPointReward of visitPointRewards) {
            const validPointRelations = visitPointReward.pointRelations.filter(relation => {
                if (relation.tierId && relation.tierId !== passData.tierId) {
                    return false
                }
                if (relation.merchant && relation.merchant.locations) {
                    return relation.merchant.locations.some(location => haversineFormulaGetDistance(position, location) < 100)
                } else {
                    return false
                }
            })

            if (validPointRelations.length > 0) {
                currentMerchants = currentMerchants.concat(validPointRelations.map(relation => relation.merchant))
                validCheckInRewardRelations = validCheckInRewardRelations.concat(validPointRelations)
            }
        }
        return { currentMerchants, validCheckInRewardRelations }
    }

    const haversineFormulaGetDistance = (pos1: Position, pos2: Position) => {
        const { latitude: lat1, longitude: long1 } = pos1
        const { latitude: lat2, longitude: long2 } = pos2
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (lat1 * Math.PI) / 180; // Convert degrees to radians
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((long2 - long1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distance between the two points in meters
        return distance
    }

    return (
        <div className={styles.container}>
            <h1 className={`${lato.className}`}>{t("CHECK_IN")}</h1>
            <div>
                {loading && <h2>{t("FINDING_MERCHANTS")}...</h2>}
                {!loading && !position && <h2>{t("GRANT_LOCATION_PERMISSIONS")}</h2>}
                {!loading && position && currentMerchants.length === 0 && <h2>{t("NO_MERCHANTS_AT_LOCATION")}</h2>}
                {!loading && position && currentMerchants.length > 0 &&
                    <div>
                        <h2>{t("CHECK_IN_NOW")}</h2>
                        {currentMerchants.map(merchant =>
                            <h2 key={merchant.id}>{merchant.name}</h2>
                        )}
                        <Button
                            size="large"
                            shape="round"
                            className={styles.button}
                            onClick={checkIn}
                            disabled={earnLoading}
                        >
                            {earnLoading ? `${t("LOADING")}...` : t("CHECK_IN")}
                        </Button>
                    </div>
                }
            </div>
        </div>
    );
};