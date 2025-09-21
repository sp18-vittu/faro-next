import { createWithEqualityFn } from 'zustand/traditional';
import { Storefront, StorefrontMarketing } from "@/shared/types/types";


interface StorefrontState {
    storefront: Storefront | null,
    storefrontMarketing: StorefrontMarketing | null,
    currentStorefrontLocale: string,
    setStorefront: (storefront: Storefront) => void,
    setCurrentStorefrontLocale: (locale: string) => void,
    setStorefrontMarketing: (storefrontMarketing: StorefrontMarketing) => void,
}

export const useStorefrontStore = createWithEqualityFn<StorefrontState>((set) => ({
    storefront: null,
    storefrontMarketing: null,
    currentStorefrontLocale: "",
    setStorefront: (storefront) => set(() => ({ storefront: JSON.parse(JSON.stringify(storefront)) })),
    setCurrentStorefrontLocale: (locale) => set(() => ({ currentStorefrontLocale: locale })),
    setStorefrontMarketing: (storefrontMarketing) => set(() => ({ storefrontMarketing: JSON.parse(JSON.stringify(storefrontMarketing)) })),
}), (a, b)=>{return false});