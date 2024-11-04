export const baseURL = "http://localhost:8080";
export const staticURL = `${baseURL}/static`;
export const ApiURL = `${baseURL}/api/v1`;

async function fetchAPI(
  method: string,
  url: string,
  data?: unknown,
  headers?: HeadersInit
) {
  return await fetch(`${ApiURL}${url}`, {
    method,
    credentials: "include",
    headers: headers || {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  });
}

export const api = {
  get: (url: string, headers?: HeadersInit) =>
    fetchAPI("GET", url, undefined, headers),
  post: (url: string, data: unknown = {}, headers?: HeadersInit) =>
    fetchAPI("POST", url, data, headers),
  put: (url: string, data: unknown, headers?: HeadersInit) =>
    fetchAPI("PUT", url, data, headers),
  delete: (url: string, headers?: HeadersInit) =>
    fetchAPI("DELETE", url, undefined, headers),
};
