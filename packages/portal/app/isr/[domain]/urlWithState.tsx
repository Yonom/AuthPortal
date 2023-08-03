export const urlWithState = (url: string) => {
  const urlObj = new URL(url, window.location.origin);

  const state = new URLSearchParams(window.location.search).get("state");
  if (state) {
    urlObj.searchParams.set("state", state);
  }

  return urlObj;
};
