const FREE_PLAN = "free";
const PROFESSIONAL_PLAN = "professional";
const BUSINESS_PLAN = "business";

export type Plan = "free" | "starter" | "professional" | "business";

export type Feature =
  | "3 forms"
  | "Unlimited forms"
  | "Unlimited team members"
  | "Unlimited form submissions"
  | "Unlimited submission archive"
  | "60 days submission archive"
  | "90 days submission archive"
  | "365 days submission archive"
  | "AJAX support"
  | "Spam Protection"
  | "Data export"
  | "Email notifications"
  | "Custom redirect"
  | "Customize thank you page"
  | "Auto responses"
  | "Domain restrictions"
  | "Webhooks"
  | "Integrations"
  | "2 Integrations"
  | "Custom honeypot"
  | "Basic support"
  | "Priority support"
  | "Submission storage duration"
  | "Remove Formbox branding";

/**
 * This is a mapping from stripe product ids to the features they unlock.
 * The keys are in the order of increasingly powerful products.
 * ex: Hobby ($10) -> Business ($20) -> Enterprise ($30)
 * ex: All the features unlocked by Business are also automatically unlocked by Enterprise.
 */
const FEATURE_UNLOCKS_BY_PLAN: Record<string, Feature[]> = {
  [FREE_PLAN]: [
    "Unlimited forms",
    "Unlimited team members",
    "Unlimited form submissions",
    "60 days submission archive",
    "AJAX support",
    "Spam Protection",
    "Data export",
    "2 Integrations",
    "Email notifications",
    "Basic support",
  ],
  // [STARTER_PLAN]: [
  //   "Unlimited forms",
  //   "Unlimited team members",
  //   "Unlimited form submissions",
  //   "90 days submission archive",
  //   "AJAX support",
  //   "Spam Protection",
  //   "Data export",
  //   "Email notifications",
  //   "Custom redirect",
  //   "Custom honeypot",
  //   "Integrations",
  //   "Basic support",
  // ],
  [PROFESSIONAL_PLAN]: [
    "Unlimited forms",
    "Unlimited team members",
    "Unlimited form submissions",
    "365 days submission archive",
    "AJAX support",
    "Spam Protection",
    "Data export",
    "Email notifications",
    "Custom redirect",
    "Customize thank you page",
    "Domain restrictions",
    "Integrations",
    "Auto responses",
    "Custom honeypot",
    "Webhooks",
    "Basic support",
    "Remove Formbox branding",
  ],
  [BUSINESS_PLAN]: [
    "Unlimited forms",
    "Unlimited team members",
    "Unlimited form submissions",
    "Unlimited submission archive",
    "AJAX support",
    "Spam Protection",
    "Data export",
    "Email notifications",
    "Custom redirect",
    "Customize thank you page",
    "Domain restrictions",
    "Integrations",
    "Auto responses",
    "Custom honeypot",
    "Webhooks",
    "Submission storage duration",
    "Priority support",
    "Remove Formbox branding",
  ],
};

const SORTED_PLANS = Object.keys(FEATURE_UNLOCKS_BY_PLAN);

export const ALL_FEATURES = Object.values(FEATURE_UNLOCKS_BY_PLAN).flat();

/**
 * hasFeatureAccess checks if a subscription has access to a feature.
 * This assumes that subscriptions on the SORTED_PRODUCT_IDS list
 * have access to all features unlocked by previous products.
 */
export function hasFeatureAccess(
  plan: string | null | undefined,
  feature: Feature,
): boolean {
  const currentPlan = plan || FREE_PLAN;

  const planINdex = SORTED_PLANS.indexOf(currentPlan as Plan);
  if (planINdex === -1) {
    console.error(`Plan ${currentPlan} is not in the list of plans`);
    return false;
  }

  const relevantFeatures = Object.values(FEATURE_UNLOCKS_BY_PLAN)
    .slice(0, planINdex + 1)
    .flatMap((x) => x);

  return relevantFeatures.includes(feature);
}
