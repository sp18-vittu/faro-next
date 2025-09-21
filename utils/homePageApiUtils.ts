import env from "@/constant/env";

import {
  Benefit,
  Program,
  ProgramTier,
  Storefront,
  StorefrontMarketing,
} from "@/shared/types/types.js";
import { API } from "@/lib/api";
const JWT_COOKIE_NAME = "jwt";
const baseURL = env.API_HOST;

export interface StorefrontResponse {
  storefront: Storefront;
  benefits: Array<Benefit>;
  title: string;
  program: Program;
  themeDetails: string[];
}

const getLowestTier = (program: Program | null): ProgramTier | undefined => {
  return program?.tiers?.sort((a: ProgramTier, b: ProgramTier) => {
    if (a.pointThreshold < b.pointThreshold) {
      return -1;
    }
    if (a.pointThreshold > b.pointThreshold) {
      return 1;
    }
    return 0;
  })[0];
};

const getUniqueBenefitsFromProgram = (
  program: Program | null
): Array<Benefit> => {
  const benefitList = new Set<Number>();
  const benefits: Array<Benefit> = [];
  program?.tiers?.forEach((tier: any) => {
    tier.benefitsTier.forEach((benefitsTier: any) => {
      if (benefitsTier?.benefit) {
        if (!benefitList.has(benefitsTier?.benefit?.id)) {
          benefitList.add(benefitsTier.benefit.id);
          benefits.push({
            ...benefitsTier.benefit,
            pointPrice: benefitsTier.pointPrice,
          } as Benefit);
        }
      }
    });
  });
  benefits.sort((a: Benefit, b: Benefit): number => {
    if (a.id > b.id) return -1;
    if (a.id < b.id) return 1;
    return 0;
  });

  return benefits;
};

export const getStoreFrontDetails = async (
  req: any,
  res: any,
  title: string,
  query: any
): Promise<StorefrontResponse> => {
  let config = {
    next: {
      // The data will be revalidated every 300 seconds (5 minutes)
      revalidate: 300,
    },
  };

  const { cacheBuster, pointRewards } = query || {};
  let url = `${baseURL}storefront/${title}`;
  let qs = "?";
  if (cacheBuster) {
    qs += `cacheBuster=true`;
  }
  if (pointRewards !== undefined && !pointRewards) {
    qs += qs.length > 1 ? `&` : "";
    qs += "pointRewards=false";
  }
  if (query.benefits !== undefined && query.benefits === false) {
    qs += qs.length > 1 ? `&` : "";
    qs += "benefits=false";
  }
  url += qs;
  const response = await fetch(url, config);

  const testData = await response.json();
  const storefront = testData as Storefront;
  const program = testData?.program;
  const themeDetails = testData?.themeDetails;
  let lowestTier: ProgramTier | undefined = undefined;

  const benefits = getUniqueBenefitsFromProgram(program);
  lowestTier = getLowestTier(program);

  // Now clear the benefits under each tier to reduce the page size
  storefront?.program?.tiers?.forEach((tier: any) => {
    tier.benefitsTier = null;
  });
  return {
    storefront,
    benefits,
    title,
    program,
    themeDetails,
  };
};

export const getStoreFrontDetailsFromClient = async (title: any) => {
  const response = await API.get(`${baseURL}storefront/${title}`);

  const testData = await response.data;
  const storefront = testData as Storefront;
  const program = testData?.program;
  let lowestTier: ProgramTier | undefined = undefined;

  const benefits = getUniqueBenefitsFromProgram(program);
  lowestTier = getLowestTier(program);

  // Now clear the benefits under each tier to reduce the page size
  storefront?.program?.tiers?.forEach((tier: any) => {
    tier.benefitsTier = null;
  });

  return {
    storefront,
    benefits,
    title,
    program,
  };
};

export const getStoreFrontMarketingFromClient = async (title: any) => {
  const response = await API.get(`storefront/${title}/marketing`);
  const testData = await response.data;
  const storefront = testData as StorefrontMarketing;

  return storefront;
};

export const getArchivedSweepstakes = async (title: string) => {
  try {
    const response = await fetch(
      `${baseURL}storefront/${title}/pastsweepstakes`
    );
    const testData = (await response.json()) as StorefrontResponse;

    const archivedSweepstakes = getUniqueBenefitsFromProgram(testData.program);

    return archivedSweepstakes;
  } catch (err) {
    console.error(err);
  }
};
