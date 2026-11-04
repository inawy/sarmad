import { useCallback, useEffect, useState } from "react";

const NAME_PARAM = "to";
const MAX_NAME_LENGTH = 40;

function readNameFromUrl(): string {
  return new URLSearchParams(window.location.search)
    .get(NAME_PARAM)
    ?.trim()
    .slice(0, MAX_NAME_LENGTH) ?? "";
}

export function useDedicationName() {
  const [name, setName] = useState(readNameFromUrl);

  const updateName = useCallback((nextValue: string) => {
    const safeValue = nextValue.slice(0, MAX_NAME_LENGTH);
    setName(safeValue);

    const url = new URL(window.location.href);
    const normalizedName = safeValue.trim();

    if (normalizedName) {
      url.searchParams.set(NAME_PARAM, normalizedName);
    } else {
      url.searchParams.delete(NAME_PARAM);
    }

    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, []);

  useEffect(() => {
    const syncFromUrl = () => setName(readNameFromUrl());

    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  return { name, updateName, maxLength: MAX_NAME_LENGTH };
}
