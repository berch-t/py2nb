export const APP_NAME = "Py2Nb";
export const APP_DESCRIPTION =
  "Transformez vos scripts Python en notebooks Jupyter professionnels avec l'IA";
export const MAX_CODE_LENGTH = 50_000; // characters
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const FREE_CONVERSIONS_LIMIT = 3;

// Line limits per plan (matches pricing page promises)
export const PLAN_LINE_LIMITS: Record<string, number> = {
  free: 500,
  pro: 5000,
  premium: Infinity,
};

// Conversion limits per plan (monthly)
export const PLAN_CONVERSION_LIMITS: Record<string, number> = {
  free: 3,
  pro: 50,
  premium: Infinity,
};

// IP-based anti-abuse: max free conversions per IP per month (across ALL accounts)
export const IP_FREE_LIMIT = 5;
