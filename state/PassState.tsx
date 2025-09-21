import { createWithEqualityFn } from 'zustand/traditional';
import { PassData, PassOwnedItems } from "@/shared/types/types";


interface PassDataState {
    passData: PassData | null;
    pointsTotal: number;
    passOwnedItems: PassOwnedItems | null;
    setPassOwnedItems: (passItems: PassOwnedItems | null) => void;
    setPassData: (passData: PassData | null) => void;
    setPointsTotal: (newTotal: number ) => void;
}

export const usePassStore = createWithEqualityFn<PassDataState>((set) => ({
    passData: null,
    pointsTotal: 0,
    passOwnedItems: null,
    setPassData: (passData) => set(() => ({ passData: passData })),
    setPointsTotal: (newPointsTotal: number) => set(() => ({ 
        pointsTotal: newPointsTotal,
     })),
     setPassOwnedItems:  (passItems) => set(() => ({ 
        passOwnedItems: passItems,
     })),
}), (a, b)=>{return false});