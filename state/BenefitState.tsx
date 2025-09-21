import { createWithEqualityFn } from 'zustand/traditional'
import {
    ProgramDetails,
    Benefit,
} from "@/shared/types/types";


interface BenefitState {
    benefits: Array<Benefit>;
    programDetails: ProgramDetails;
    currentBenefitId: number;
    currentBenefit: Benefit | null;
    setCurrentBenefitId: (id: number) => void;
    setBenefits: (benefits: Array<Benefit>) => void;
    setCurrentBenefit: (benefit: Benefit) => void;
    setProgramDetails: (programDetails: ProgramDetails) => void;
}

export const useBenefitStore = createWithEqualityFn<BenefitState>((set) => ({
    benefits: [],
    programDetails: {
        name: "",
        description: "",
        locales: [],
        pointsEnabled: false,
        pointRewards: [],
        lowestTier: undefined,
    },
    currentBenefitId: 0,
    currentBenefit: null,
    setCurrentBenefitId: (id) => set(() => ({ currentBenefitId: id })),
    setBenefits: (benefits) => set(() => ({ 
        benefits: JSON.parse(JSON.stringify(benefits)) 
    })),
    setCurrentBenefit: (benefit) => set(() => ({ currentBenefit: benefit })),
    setProgramDetails: (details) =>
        set(() => ({
            programDetails: details,
        })),
}),(a, b)=>{return false});
