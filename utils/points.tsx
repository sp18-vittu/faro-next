import { Benefit, PointRecord, PassData } from "@/shared/types/types";
import { message } from "antd";
import { earnPoints } from "@/utils/commonApiUtils";

export const earnPointsFromRelation = (passData: PassData|null, relation: Benefit, t: any) => {
    if (passData && relation.pointRelations.length > 0) {
        const pointRelationIds = relation.pointRelations.filter(r => !r.tierId || r.tierId == passData.tierId).map(r => r.id)
        earnPoints(pointRelationIds, passData.passId).then(res => {
            if (res.status === 200) {
                const { connectedPass, earnedPointsRecords } = res.data
                const totalEarnedPoints = earnedPointsRecords.reduce((sum: number, record: PointRecord) => sum + record.earnedPoints, 0)
                if (totalEarnedPoints > 0) {
                    message.success(`${t("CONGRATULATIONS_YOU'VE_EARNED_POINTS")} ${t("POINTS_EARNED")}: ${totalEarnedPoints} ${t("TOTAL_POINTS")}: ${connectedPass.pointsTotal}`)
                }
            }
        })
    }
}