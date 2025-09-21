import { createWithEqualityFn } from 'zustand/traditional'

interface BenefitModalState {
    visible: boolean,
    setVisible: () => void,
    setNotVisible: () => void
}

export const useBenefitModalStore = createWithEqualityFn<BenefitModalState>((set) => ({
    visible: false,
    setVisible: () => set(() => ({ visible: true })),
    setNotVisible: () => set(() => ({ visible: false }))
}), (a, b)=>{return false});
