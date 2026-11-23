// Client-side helper for talking to the Express API with a JWT.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

let cachedToken: string | null = null;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function networkError(): ApiError {
  return new ApiError(
    `Cannot reach the library API at ${API_URL}. Make sure the Express server is running (cd book-server && npm start).`,
    0,
  );
}


export async function getToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;
  try {
    const res = await fetch("/api/token", { cache: "no-store" });

    if (!res.ok) return null;
    const data = (await res.json()) as { token?: string };

    cachedToken = data.token ?? null;

    return cachedToken;

  } catch {
    return null;
  }
}

export function clearToken() {
  cachedToken = null;
}

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

  body?: unknown;
  /** Set false for public endpoints that don't need a JWT. */
  auth?: boolean;

}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},

): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const doFetch = async (token: string | null) => {

    const headers: Record<string, string> = {};

   
    if (body !== undefined) headers["Content-Type"] = "application/json";


    if (token) headers.Authorization = `Bearer ${token}`;

    return fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  };

  let token = auth ? await getToken() : null;

  if (auth && !token) {
    throw new ApiError("You must be logged in to do that", 401);
  }

  let res: Response;
  try {
    res = await doFetch(token);
  } catch {

    throw networkError();
  }

  if (res.status === 401 && auth) {
    clearToken();
    token = await getToken();
    try {
      res = await doFetch(token);

    } catch {
      throw networkError();
    }
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(

      (data as { message?: string } | null)?.message ??
      
        `Request failed (${res.status})`,
      res.status,
    );
  }
  return data as T;
}
