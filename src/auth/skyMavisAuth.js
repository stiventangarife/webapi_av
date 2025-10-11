import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  SKYMAVIS_AUTH_URL,
  SKYMAVIS_TOKEN_URL,
  X_API_KEY,
} = process.env;

// Redirige al login de Sky Mavis
export function getLoginUrl(state) {
  const authUrl = `${SKYMAVIS_AUTH_URL}?client_id=${encodeURIComponent(CLIENT_ID)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=openid%20profile&state=${encodeURIComponent(state)}`;
  return authUrl;
}

// Intercambia code por tokens
export async function exchangeCodeForTokens(code) {
  const form = new URLSearchParams();
  form.append("grant_type", "authorization_code");
  form.append("code", code);
  form.append("redirect_uri", REDIRECT_URI);
  form.append("client_id", CLIENT_ID);
  form.append("client_secret", CLIENT_SECRET);

  const resp = await fetch(SKYMAVIS_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-API-Key": X_API_KEY || "",
    },
    body: form.toString(),
  });

  if (!resp.ok) {
    throw new Error(`Token request failed: ${resp.statusText}`);
  }

  const data = await resp.json();
  return data; // { access_token, id_token, refresh_token, ... }
}
