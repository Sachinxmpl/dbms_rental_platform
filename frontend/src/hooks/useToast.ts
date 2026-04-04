import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info";
export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastSetter: ((t: Toast) => void) | null = null;

export function registerToastSetter(fn: (t: Toast) => void) {
  toastSetter = fn;
}

export function toast(message: string, type: ToastType = "info") {
  toastSetter?.({ id: Date.now(), message, type });
}

export function useToastState() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = useCallback((t: Toast) => {
    setToasts((prev) => [...prev, t]);
    setTimeout(
      () => setToasts((prev) => prev.filter((x) => x.id !== t.id)),
      3500,
    );
  }, []);
  return { toasts, add };
}
