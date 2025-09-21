import { createWithEqualityFn } from 'zustand/traditional';
import { StorefrontLocale } from "@/shared/types/types";

interface SelectedLocale {
    currentLocaleId: string | null,
    setSelectedLocale: (localeId: string) => void,
    currentStorefrontLocale: StorefrontLocale | null,
    setCurrentStorefrontLocale: (storefrontLocale: StorefrontLocale) => void;
}

export const useSelectedLocaleStore = createWithEqualityFn<SelectedLocale>((set) => ({
    currentLocaleId: null,
    setSelectedLocale: (localeId) => set(() => ({ currentLocaleId: localeId })),
    currentStorefrontLocale: null,
    setCurrentStorefrontLocale: (storefrontLocale) => 
            set(() => ({ currentStorefrontLocale: storefrontLocale })),
}), (a, b)=>{return false});