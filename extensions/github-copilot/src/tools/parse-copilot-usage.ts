import type { CopilotInternalUserResponse, CopilotUsage } from "../services/copilot";

/**
 * Parses the internal Copilot usage response to extract usage data.
 * @param response The internal Copilot usage response
 * @returns The parsed Copilot usage data
 */
export const parseUsageData = (response: CopilotInternalUserResponse): CopilotUsage => {
  const snapshots = response.quota_snapshots;

  // Extract completions (code completions)
  const completionsSnapshot = snapshots.completions;
  const inlineSuggestionsLimit = completionsSnapshot?.unlimited ? null : (completionsSnapshot?.entitlement ?? 0);
  const inlineSuggestionsCurrent = completionsSnapshot?.unlimited
    ? 0
    : (completionsSnapshot?.entitlement ?? 0) - (completionsSnapshot?.remaining ?? 0);

  // Extract chat messages
  const chatSnapshot = snapshots.chat;
  const chatMessagesLimit = chatSnapshot?.unlimited ? null : (chatSnapshot?.entitlement ?? 0);
  const chatMessagesCurrent = chatSnapshot?.unlimited
    ? 0
    : (chatSnapshot?.entitlement ?? 0) - (chatSnapshot?.remaining ?? 0);

  // Extract premium interactions (premium requests)
  const premiumSnapshot = snapshots.premium_interactions;
  const premiumRequestsLimit = premiumSnapshot?.unlimited ? null : (premiumSnapshot?.entitlement ?? 0);
  const premiumRequestsCurrent = premiumSnapshot?.unlimited
    ? 0
    : (premiumSnapshot?.entitlement ?? 0) - (premiumSnapshot?.remaining ?? 0);

  return {
    inlineSuggestions: {
      current: inlineSuggestionsCurrent,
      limit: inlineSuggestionsLimit,
    },
    chatMessages: {
      current: chatMessagesCurrent,
      limit: chatMessagesLimit,
    },
    premiumRequests: {
      current: premiumRequestsCurrent,
      limit: premiumRequestsLimit,
    },
    allowanceResetAt: response.quota_reset_date_utc || new Date().toISOString(),
  };
};
