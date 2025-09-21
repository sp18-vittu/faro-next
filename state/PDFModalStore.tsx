import { createWithEqualityFn } from 'zustand/traditional';

interface PDFModalState {
    visible: boolean,
    setVisible: () => void,
    setNotVisible: () => void
}

export const usePDFModalStore = createWithEqualityFn<PDFModalState>((set) => ({
    visible: false,
    setVisible: () => set(() => ({ visible: true })),
    setNotVisible: () => set(() => ({ visible: false }))
}), (a, b)=>{return false});
