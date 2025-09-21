import { Benefit } from "@/shared/types/types";

import { createWithEqualityFn } from "zustand/traditional";
interface BenefitState {
  page: string;
  setPage: (page: string) => void;
  benefitCategories: {
    [key: string]: Benefit[];
  };
  setBenefitCategories: (val: { [key: string]: Benefit[] }) => void;
}

export const useCommercialPageStore = createWithEqualityFn<BenefitState>(
  (set) => ({
    page: "Home",
    setPage: (page) =>
      set(() => ({
        page: page,
      })),
    benefitCategories: {},
    setBenefitCategories: (benefitCategories) =>
      set(() => ({
        benefitCategories: benefitCategories,
      })),
  }),
  (a, b) => {
    return false;
  }
);
