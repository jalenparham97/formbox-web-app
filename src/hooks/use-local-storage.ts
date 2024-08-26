import { useWindow } from "./use-window";

export function useLocalStorage() {
  const window = useWindow();
  return window?.localStorage;
}
