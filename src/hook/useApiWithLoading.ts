// src/hook/useApiWithLoading.ts
import { useLoading } from "./AuthContext";

export const useApiWithLoading = (minDelay = 1000) => {
  const { setLoadingPage } = useLoading();

  const callApi = async <T>(
    apiFunc: () => Promise<T>,
    onSuccess: (data: T) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError?: (error: any) => void
  ) => {
    setLoadingPage(true);
    const start = Date.now();

    try {
      const result = await apiFunc();
      onSuccess(result);
    } catch (error) {
      console.error("API error:", error);
      if (onError) onError(error);
    } finally {
      const elapsed = Date.now() - start;
      const delay = Math.max(0, minDelay - elapsed);
      setTimeout(() => setLoadingPage(false), delay);
    }
  };

  return { callApi };
};
