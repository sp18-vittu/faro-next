import locale from "antd/es/date-picker/locale/en_US";
import { JsxElement } from "typescript";

export enum LoginMethod {
  EMAIL = "Email",
  SMS = "SMS",
  EMAILANDSMS = "EmailAndSMS",
  DEFAULT = "Default",
}

export interface BenefitSortCriteria {
  name?: string;
  id?: number;
  categoryId?: number;
  benefitType?: string;
  sortOrder: "asc" | "desc";
  sortBy: "CreatedDate" | "StartDate" | "ActiveDate";
}

export interface HeroImage {
  imageUrl: string;
  startDate: string | undefined;
  endDate: string | undefined;
  status: "inActive" | "active";
  redirectUrl: string | undefined;
}

export interface Storefront {
  id: number;
  title: string;
  companyId: number;
  programId: number;
  collectionId?: number;
  cnameUrl?: string;
  logoUrl: string;
  heroImageUrl: string;
  heroHeadline: string;
  heroBenefitsHeadline?: string;
  heroBenefitsDescription?: string;
  heroDesc?: string;
  marketingHeadline?: string;
  marketingDesc?: string;
  name: string;
  description: string;
  headerText: string;
  bodyText: string;
  enableFooter: boolean;
  companyName: string;
  websiteUrl?: string;
  twitterUrl?: string;
  discordUrl?: string;
  mediumUrl?: string;
  defaultLocaleId: string;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  program: Program;
  locales: StorefrontLocale[];
  // marketingData: MarketingData[];
  pointsTableHeaderText: string;
  pointsTableBodyText: string;
  defaultChain: string;
  themeId?: string;
  loginMethod: LoginMethod;
  footerText: string | null;
  enablePointsTable: boolean;
  enableProgramTable: boolean;
  showBenefitsCarousel: boolean;
  // pointsMarketingData?: PointsData[];
  merchants: Merchant[];
  rememberMeInDays: number;
  defaultSmsCountryCode: string;
  smsSupportedCountries: string;
  preRegisterUser: boolean;
  benefitSortBy: "BenefitType" | "Category";
  showProgramName: boolean;
  benefitSortCriteria: BenefitSortCriteria[];
  hiddenMenuItems: Array<"viewPass" | "checkIn" | "faq">;
  showImageOnly: boolean;
  membershipCriteria?: "NotRequired" | "Visible" | "NotVisible";
  heroImages: HeroImage[];
  notifications: Notification[];
  categoryImages?: {
    categoryId: string;
    url: string;
  }[];
}

export interface StorefrontMarketing {
  id: number;
  title: string;
  marketingHeadline?: string;
  marketingDesc?: string;
  headerText: string;
  bodyText: string;
  marketingData: MarketingData[];
  pointsTableHeaderText: string;
  pointsTableBodyText: string;
  pointsMarketingData?: PointsData[];
}

export interface ProgramBenefits {
  benefit: Benefit;
  id: number;
  benefitsTier: any;
}

export interface ProgramTiers {
  tiers: Array<ProgramBenefits>;
}

export interface ProgramDetailsLocales {
  id: number;
  programId: number;
  localeId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramDetails {
  name: string;
  description: string;
  locales: ProgramDetailsLocales[];
  pointsEnabled: boolean | undefined;
  pointRewards: PointReward[];
  lowestTier: ProgramTier | undefined;
}

export interface BenefitResource {
  id: number;
  name: string;
  description?: string;
  previewResourceUrl?: string;
  resourceUrl?: string;
  author?: string;
  type: string;
  companyId: number;
  benefitId: number;
  createdAt: string;
  updatedAt: string;
}

export interface DefaultLocale {
  localeId: string;
  countryCode: string;
  languageCode: string;
  isSupported: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LocaleDetails {
  localeId: string;
  label: string;
  icon: JsxElement;
  title: string;
}

export interface StorefrontLocale {
  id: number;
  storefrontId: number;
  localeId: string;
  logoUrl: string;
  headerText: string;
  bodyText: string;
  heroBenefitsHeadline?: string;
  heroBenefitsDescription?: string;
  companyName: string;
  websiteUrl?: string;
  twitterUrl?: string;
  discordUrl?: string;
  mediumUrl?: string;
  heroImageUrl?: string;
  heroHeadline?: string;
  heroDesc?: string;
  marketingHeadline?: string;
  marketingDesc?: string;
  pointsTableHeaderText?: string;
  pointsTableBodyText?: string;
  createdAt: Date;
  footerText: string | null;
}

export interface MarketingData {
  description: string;
  status: string;
  tiers: MarketingDataTier[];
  locales: MarketingDataLocale[];
  reward: string;
}

export interface MarketingDataLocale {
  id: number;
  programMarketingId: number;
  localeId: string;
  reward: string;
  description: string;
}

export interface PointsData {
  id: number;
  wayToEarn: string;
  pointValue: number;
  position: number;
  locales: PointsDataLocale[];
}

export interface PointsDataLocale {
  id: number;
  wayToEarn: string;
  localeId: string;
  pointsMarketingId: number;
}

export enum BenefitType {
  AudioBenefit = "audio",
  VideoBenefit = "video",
  DiscountBenefit = "coupon",
  PDFBenefit = "digitalbook",
  SweepstakesBenefit = "sweepstakes",
  StreamingBenefit = "streams",
  SurveyBenefit = "survey",
}

export interface TierLocale {
  tierId: number;
  localeId: string;
  name: string;
  tierBenefits: string;
  description: string;
  information: string;
}

export interface MarketingDataTier {
  tierId: number;
  tier: Tier;
}

export interface Tier {
  name: string;
  id: number;
  pointThreshold: number;
  locales: TierLocale[];
  tierBenefits?: string;
  description?: string;
  information?: string;
}

export interface Program {
  locales: ProgramDetailsLocales[];
  name: string;
  description: string;
  pointsEnabled?: boolean;
  pointRewards: PointReward[];
  tiers: ProgramTier[];
  lowestTier: ProgramTier;
}

export interface ProgramTier {
  id: number;
  locales: any[];
  benefitsTier: BenefitsTier[];
  pointThreshold: number;
}

export interface BenefitsTier {
  benefitId: number;
  pointPrice: any;
  benefit: Benefit;
}

export interface BenefitLocale {
  id: number;
  benefitId: number;
  localeId: string;
  title?: string;
  shortDescription?: null | string;
  description?: string;
  logoUrl?: null | string;
  previewResourceUrl?: string | null;
  resourceUrl?: null | string;
  disclaimer?: null | string;
}

export interface Benefit {
  id: number;
  title: string;
  shortDescription?: string;
  description: string;
  logoUrl?: string;
  previewResourceUrl?: string;
  resourceUrl?: string;
  disclaimer?: string;
  type: BenefitType;
  originalPrice?: number;
  discountPrice?: number;
  redemptionPerPass?: number;
  couponCode?: string;
  discountType: DiscountType;
  unlimitedRedemption: boolean;
  ownershipRequired: boolean;
  startDate?: string;
  activeDate?: string;
  endDate?: string;
  status: string;
  currencyCode?: string;
  currencySymbol?: string;
  allowDownload: boolean;
  multipleResource: boolean;
  merchantId?: number;
  BenefitResource: BenefitResource[];
  collectionsAttached?: number[];
  tierAttached?: number[];
  locales: BenefitLocale[];
  pointPrice?: number;
  pointRelations: PointRelation[];
  tier: string;
  membershipRequired: boolean;
  showImagesOnly: number;
  surveyQuestions: any;
  partnerRedirectUrl: string;
  tierBenefits: {
    id: number;
    tierId: number;
    benefitId: number;
  }[];
  sweepStake?: {
    resultAnnouncementDate: string;
    rewardCount: number;
    isFastPass: boolean;
    showUntilDate: string;
  };
  category?: {
    id: number;
    name: string;
  };
  membershipCriteria?: "NotRequired" | "Visible" | "NotVisible";
  _count: {
    sweepStakesRegistrations: number;
  };
}

export interface Notification {
  benefit: Benefit;
  id: number;
  title: string;
  message: string;
  expiryDate: string | null;
  userCriteria: string;
  type: string;
  scheduledDate: string;
  benefitId: number;
  createdAt: string;
  updatedAt: string;
  pressReleaseId: string | null;
  notificationTrackers: {
    viewCount: number;
  }[];
}

export interface SweepstakeRegStatus {
  canRegister: boolean;
  error?: {
    message: string;
  };
  registration?: {
    id: number;
    benefitId: number;
    passId: number;
    sequenceNumber: number;
    winnerPosition: string | null;
    isWinner: boolean;
    winningDate: string | null;
    createdAt: string;
  };
}

export enum DiscountType {
  Flat = "flat",
  Percentage = "percentage",
  Partner = "partner",
}

export interface Merchant {
  id: number;
  name: string;
  url?: string;
  description: string;
  logoUrl: string;
  heroImageUrl: string;
  status: string;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  defaultLocaleId: string;
  phoneNumber?: string;
  email?: string;
  defaultLocale: DefaultLocale;
  locales: MerchantLocale[];
  locations: MerchantLocation[];
  selfRedeem: false;
}

export interface MerchantLocation {
  id: number;
  latitude: number;
  longitude: number;
  merchantId: number;
  name: string;
}

export interface MerchantLocale {
  id: number;
  merchantId: number;
  localeId: string;
  name: string;
  url?: string;
  description: string;
  logoUrl?: string;
  heroImageUrl: string;
}

export interface PassData {
  id: number;
  passId: string;
  passUrl: string;
  walletAddress: string;
  status: string;
  expiryDate?: null;
  tierId: number;
  programId: number;
  createdAt: string;
  updatedAt: string;
  pointsTotal: number;
  nextPointsToExpireId?: null;
  nextPointsToExpireValue?: null;
  connectedPassItems?: ConnectedPassItemsEntity[] | null;
  tier: PassTier;
  storefrontId?: number;
  newUser: boolean;
  isViewed: boolean;
  isDownloaded: boolean;
}

export interface ConnectedPassItemsEntity {
  id: number;
  passId: number;
  storefrontId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PassTier {
  id: number;
  programId: number;
  passkitId: string;
  passkitTemplateId: string;
  name: string;
  index: number;
  passColors: PassColors;
  tierBenefits: string;
  description: string;
  information: string;
  informationFieldLockscreenMessage?: null;
  logoImageUrl: string;
  logoImagePasskitId: string;
  appleLogoImageUrl: string;
  appleLogoImagePasskitId: string;
  stripImageUrl: string;
  stripImageUrlPasskitId: string;
  heroImageUrl: string;
  heroImageUrlPasskitId: string;
  samplePassUrl: string;
  companyName: string;
  programName: string;
  appleLogoSize: string;
  defaultLocaleId: string;
  localeData?: null;
  createdAt: string;
  updatedAt: string;
  expiryDate: string;
  pointThreshold: number;
}

export interface PassColors {
  textColor?: string;
  stripColor?: string;
  labelColor?: string;
}

export interface PointRelation {
  id: number;
  benefitId: number | null;
  collectionId: number | null;
  merchantId: number | null;
  merchant: Merchant;
  pointsRewardId: number | null;
  tierId: number | null;
  pointsReward: PointReward;
}

export interface PointReward {
  actionType: string;
  currencyCode?: string;
  description?: string;
  endDate?: string;
  frequency: string;
  frequencyLimit?: number;
  id: number;
  isStreakReward: boolean;
  name: string;
  perPassLimit?: number;
  pointReward: number;
  pointsPerUnitCurrency?: number;
  programId: number;
  socialMediaActionType?: string;
  startDate?: string;
  status: string;
  streakCount?: number;
  streakFrequency?: string;
  pointRelations: PointRelation[];
}

export interface PointRecord {
  createdAt: string;
  earnedPoints: number;
  expirationDate: string;
  id: number;
  passId: string;
  pointRelationId: number;
  programId: number;
  redeemedPoints: number;
  socialMedia?: string;
  streakNumber?: number;
  type: string;
}

export interface LocalesTypes {
  ja: string;
  hi: string;
  es: string;
  en: string;
}

export interface PointRewardsForUserStreak {
  id: number;
  programId: number;
  name: string;
  description?: string;
  pointReward: number;
  isStreakReward: boolean;
  streakCount?: number;
  streakFrequency?: string;
  startDate?: string;
  endDate?: string;
  frequency: string;
  frequencyLimit?: number;
  perPassLimit?: number;
  status: string;
  actionType: string;
  socialMediaActionType?: string | null;
  pointRelations: PointRelationForUserStreak[];
}

export interface PointRelationForUserStreak {
  benefit?: Benefit;
  merchant?: Merchant;
  id: number;
  userStreak?: UserStreak[];
}

export interface UserStreak {
  id: number;
  passId: string;
  programId: number;
  pointRelationId: number;
  createdAt: string;
  earnedPoints: number;
  expirationDate: string;
  redeemedPoints: number;
  type: string;
  socialMedia: any;
  streakNumber: number;
}

export interface PassOwnedItems {
  benefitList: BenefitList[];
}

export interface BenefitList {
  id: number;
  passkitId: string;
  passId: number;
  benefitId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IFaqs {
  answer: string;
  createdAt: string;
  id: number;
  localeId: string;
  question: string;
  storefrontId: number;
  updatedAt: string;
}

export interface RedeemStatus {
  isRedeemable: boolean;
  error?: Error;
  details?: RedemptionDetails;
}

export interface Error {
  message: string;
}

export interface RedemptionDetails {
  id: number;
  benefitId: number;
  passkitId: any;
  passId: number;
  redeemerId: any;
  createdAt: string;
}

export interface RedeemData {
  message: string;
  numRedeemedTotal: number;
  numRedeemedThisPass: number;
  numRedeemedThisFrequency: number;
  transactionId: string;
}

export interface BenefitNotification {
  id: number;
  benefitId: number;
  title: string;
  message: string;
  merchant: Merchant;
  expiryDate: string | null;
  scheduledDate: string | null;
  userCriteria: string | null;
  notificationTrackers: { viewCount: number }[];
}

export interface UserDetails {
  country: string | null;
  email: string;
  firstName: string | null;
  id: number;
  inviterReferralCode: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastName: string | null;
  password: string | null;
  phoneNumber: string;
  referralCode: string;
  resetPasswordToken: string | null;
  resetPasswordTokenExpireAt: string | null;
  state: string | null;
  storefrontId: number;
  street1: string | null;
  street2: string | null;
  verifyEmailToken: string | null;
  zipcode: string | null;
}

// For categorizing benefits on commercial template
export interface BenefitCategories {
  // Categorizing by benefit types
  coupon: Benefit[];
  sweepstakes: Benefit[];
  video: Benefit[];
  audio: Benefit[];
  digitalbook: Benefit[];
  streams: Benefit[];
  survey: Benefit[];

  // Categorizing by merchant categories
  shopping: Benefit[];
  dining: Benefit[];
  entertainment: Benefit[];
  artists: Benefit[];
  experiences: Benefit[];
  miscellaneous: Benefit[];
  art: Benefit[];
  sports: Benefit[];
  lifestyle: Benefit[];
  travel: Benefit[];
  business: Benefit[];
  pop_culture: Benefit[];

  [key: string]: Benefit[];
}
