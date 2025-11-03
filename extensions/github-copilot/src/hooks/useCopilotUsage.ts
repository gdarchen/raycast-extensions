import { useState, useEffect, useCallback } from "react";
import { CopilotUsage } from "../services/copilot";

export function useCopilotUsage(fetchUsage: () => Promise<CopilotUsage>) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [usage, setUsage] = useState<CopilotUsage | null>(null);

  const loadUsage = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsage();
      setUsage(data);
    } catch (error) {
      console.error("Failed to fetch Copilot usage:", error);
      setUsage(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsage]);

  useEffect(() => {
    loadUsage();
  }, [loadUsage]);

  return { isLoading, usage, revalidate: loadUsage };
}
