// lib/events.ts
export const BALANCE_UPDATE_EVENT = "balance-update";

export function emitBalanceUpdate() {
  window.dispatchEvent(new CustomEvent(BALANCE_UPDATE_EVENT));
}

export function onBalanceUpdate(callback: () => void) {
  window.addEventListener(BALANCE_UPDATE_EVENT, callback);

  // Return cleanup function
  return () => {
    window.removeEventListener(BALANCE_UPDATE_EVENT, callback);
  };
}
