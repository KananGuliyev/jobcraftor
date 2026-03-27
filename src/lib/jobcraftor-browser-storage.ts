export function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readStoredJson(storageKey: string) {
  if (!canUseBrowserStorage()) {
    return null;
  }

  return window.localStorage.getItem(storageKey);
}

export function writeStoredJson(storageKey: string, value: unknown) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

export function clearStoredJson(storageKey: string) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.removeItem(storageKey);
}

export function createLocalRecordId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
