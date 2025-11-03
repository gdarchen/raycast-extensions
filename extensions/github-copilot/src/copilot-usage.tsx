import { List, Icon, Color, Action, ActionPanel } from "@raycast/api";
import { useCallback } from "react";
import { useCopilotUsage } from "./hooks/useCopilotUsage";
import { fetchCopilotUsage } from "./services/copilot";

function Command() {
  const fetchUsage = useCallback(() => fetchCopilotUsage(), []);

  const { isLoading, usage, revalidate } = useCopilotUsage(fetchUsage);

  const formatUsage = (current: number, limit: number | null): string => {
    if (limit === null) {
      return "Included";
    }
    const percentage = ((current / limit) * 100).toFixed(1);
    return `${percentage}%`;
  };

  const getProgressColor = (current: number, limit: number | null): Color => {
    if (limit === null) {
      return Color.Green;
    }
    const percentage = (current / limit) * 100;
    if (percentage >= 90) {
      return Color.Red;
    } else if (percentage >= 70) {
      return Color.Orange;
    }
    return Color.Blue;
  };

  const formatResetDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!usage && !isLoading) {
    return (
      <List>
        <List.EmptyView
          icon={{ source: "copilot.svg", tintColor: Color.PrimaryText }}
          title="Usage Data Not Available"
          description="Failed to fetch usage data. Please check your connection."
        />
      </List>
    );
  }

  return (
    <List isLoading={isLoading}>
      {usage && (
        <>
          <List.Section title="Copilot Usage">
            <List.Item
              title="Code completions"
              accessories={[
                {
                  text: formatUsage(usage.inlineSuggestions.current, usage.inlineSuggestions.limit),
                  icon: {
                    source: Icon.BarChart,
                    tintColor: getProgressColor(usage.inlineSuggestions.current, usage.inlineSuggestions.limit),
                  },
                },
              ]}
              icon={{ source: Icon.Code, tintColor: Color.PrimaryText }}
              actions={
                <ActionPanel>
                  <Action title="Refresh" onAction={revalidate} />
                </ActionPanel>
              }
            />
            <List.Item
              title="Chat messages"
              accessories={[
                {
                  text: formatUsage(usage.chatMessages.current, usage.chatMessages.limit),
                  icon: {
                    source: Icon.BarChart,
                    tintColor: getProgressColor(usage.chatMessages.current, usage.chatMessages.limit),
                  },
                },
              ]}
              icon={{ source: Icon.Message, tintColor: Color.PrimaryText }}
              actions={
                <ActionPanel>
                  <Action title="Refresh" onAction={revalidate} />
                </ActionPanel>
              }
            />
            <List.Item
              title="Premium requests"
              accessories={[
                {
                  text: formatUsage(usage.premiumRequests.current, usage.premiumRequests.limit),
                  icon: {
                    source: Icon.BarChart,
                    tintColor: getProgressColor(usage.premiumRequests.current, usage.premiumRequests.limit),
                  },
                },
              ]}
              icon={{ source: Icon.Star, tintColor: Color.PrimaryText }}
              actions={
                <ActionPanel>
                  <Action title="Refresh" onAction={revalidate} />
                </ActionPanel>
              }
            />
          </List.Section>
          <List.Section title="">
            <List.Item
              title="Additional paid premium requests enabled."
              icon={{ source: Icon.Info, tintColor: Color.SecondaryText }}
              actions={
                <ActionPanel>
                  <Action title="Refresh" onAction={revalidate} />
                </ActionPanel>
              }
            />
            <List.Item
              title={`Allowance resets ${formatResetDate(usage.allowanceResetAt)}.`}
              icon={{ source: Icon.Clock, tintColor: Color.SecondaryText }}
              actions={
                <ActionPanel>
                  <Action title="Refresh" onAction={revalidate} />
                </ActionPanel>
              }
            />
          </List.Section>
        </>
      )}
    </List>
  );
}

export default Command;
