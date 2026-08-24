// Meta restricted API access for the Wiwitan Facebook app (unresolved platform
// violation as of Aug 2026), so Facebook Login is unusable for any user until
// that's cleared. Hide the button rather than let people hit a dead-end error.
// Flip back to true once Meta's review clears and the app is back to Live status.
export const FACEBOOK_LOGIN_ENABLED = false;
