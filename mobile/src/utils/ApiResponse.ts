export const getApiErrorStatus = (response: unknown): number | null => {
  if (response === 401) {
    return null;
  }

  return typeof response === "number" ? response : 500;
};
