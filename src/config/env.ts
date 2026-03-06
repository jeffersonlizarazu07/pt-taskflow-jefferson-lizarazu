const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    'Missing required environment variable: NEXT_PUBLIC_API_BASE_URL'
  );
}

export const env = {
  apiBaseUrl: API_BASE_URL,
} as const;