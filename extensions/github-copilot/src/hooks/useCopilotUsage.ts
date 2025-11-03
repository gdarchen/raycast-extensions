import { usePromise } from "@raycast/utils";
import { CopilotUsage } from "../services/copilot";

export function useCopilotUsage(fetchUsage: () => Promise<CopilotUsage>) {
  const { isLoading, data: usage, revalidate } = usePromise(fetchUsage, [], { execute: true });

  return { isLoading, usage, revalidate };
}
