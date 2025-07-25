import { useCallback } from "react";

// Simple toast using window.alert (replace with your own toast logic if needed)
export function useToast() {
  const toast = useCallback(({ title, description }) => {
    window.alert(`${title}\n${description || ""}`);
  }, []);
  return { toast };
}