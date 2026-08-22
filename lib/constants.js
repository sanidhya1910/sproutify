// EcoTokens awarded to a volunteer each time their attendance at an event is
// confirmed (either an admin marking them present, or a self-service QR
// check-in). Kept as a single named constant so award/revoke logic — which
// lives in two places (manual admin attendance, QR self check-in) — always
// agrees on the amount.
export const TOKENS_PER_ATTENDANCE = 20;
