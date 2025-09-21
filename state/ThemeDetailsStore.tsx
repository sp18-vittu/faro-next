import { createWithEqualityFn } from "zustand/traditional";

interface BenefitState {
  themeDetails: string[];
  setThemeDetails: (themeDetails: string[]) => void;
}

export const useThemeStore = createWithEqualityFn<BenefitState>((set) => ({
  themeDetails: [],
  setThemeDetails: (themeDetails) =>
    set(() => ({
      themeDetails: JSON.parse(JSON.stringify(themeDetails)),
    })),
}), (a, b)=>{return false});
