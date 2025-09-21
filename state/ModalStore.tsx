import { createWithEqualityFn } from 'zustand/traditional';

interface ModalState {
  claimModalVisible: boolean;
  setClaimModalVisible: () => void;
  setClaimModalNotVisible: () => void;
  mode: string;
  setViewPass: () => void;
  setCheckIn: () => void;
  setSignIn: () => void;
  setProfile: () => void;
  setInviteUser: () => void;
  setFaq: () => void;
  setForgotPassword: () => void;
  setSignUp: () => void;
  setPreRegister: () => void;
  marketingModalVisible: boolean;
  setMarketingModalVisible: () => void;
  setMarketingmModalNotVisible: () => void;
  promotionsModalVisible: boolean;
  setPromotionsModalVisible: () => void;
  setPromotionsmModalNotVisible: () => void;
}

export const useModalStore = createWithEqualityFn<ModalState>((set) => ({
  claimModalVisible: false,
  setClaimModalVisible: () =>
    set(() => ({
      marketingModalVisible: false,
      claimModalVisible: true,
      promotionsModalVisible: false,
    })),
  setClaimModalNotVisible: () => set(() => ({ claimModalVisible: false })),
  mode: "signIn",
  setViewPass: () => set(() => ({ mode: "viewPass" })),
  setCheckIn: () => set(() => ({ mode: "checkIn" })),
  setSignIn: () => set(() => ({ mode: "signIn" })),
  setSignUp: () => set(() => ({ mode: "signUp" })),
  setPreRegister: () => set(() => ({ mode: "preRegister" })),
  setProfile: () => set(() => ({ mode: "profile" })),
  setInviteUser: () => set(() => ({ mode: "inviteUser" })),
  setFaq: () => set(() => ({ mode: "faq" })),
  setForgotPassword: () => set(() => ({ mode: "forgotPassword" })),
  marketingModalVisible: false,
  setMarketingModalVisible: () =>
    set(() => ({
      marketingModalVisible: true,
      claimModalVisible: false,
      promotionsModalVisible: false,
    })),
  setMarketingmModalNotVisible: () =>
    set(() => ({
      marketingModalVisible: false,
    })),
  promotionsModalVisible: false,
  setPromotionsModalVisible: () =>
    set(() => ({
      marketingModalVisible: false,
      claimModalVisible: false,
      promotionsModalVisible: true,
    })),
  setPromotionsmModalNotVisible: () =>
    set(() => ({
      promotionsModalVisible: false,
    })),
}), (a, b)=>{return false});
