import { createWithEqualityFn } from 'zustand/traditional';

interface WalletState {
    name: string,
    label: string,
    icon: string,
    provider: any,
    isDefault: boolean
}

export interface WalletStoreState {
  
    isLoggedIn: boolean,
   
    setIsLoggedIn: (login: boolean) => void,
}

export const useWalletStore = createWithEqualityFn<WalletStoreState>((set: any) => ({
   
    isLoggedIn: false,
   
    setIsLoggedIn: (login: boolean) => set(() => ({ isLoggedIn: login })),
}), (a, b)=>{return false});