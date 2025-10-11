import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const {
  SKY_MAVIS_CLIENT_ID,
  SKY_MAVIS_CORRELATION_KEY,
  SKY_MAVIS_REDIRECT_URI,
  SKY_MAVIS_AUTH_URL,
  SKY_MAVIS_TOKEN_URL
} = process.env;

// Redirige al login de Sky Mavis
export function getLoginUrl(state) {
  const authUrl = `${SKY_MAVIS_AUTH_URL}?client_id=${encodeURIComponent(
    SKY_MAVIS_CLIENT_ID
  )}&redirect_uri=${encodeURIComponent(
    SKY_MAVIS_REDIRECT_URI
  )}&response_type=code&scope=openid%20profile&state=${encodeURIComponent(
    state
  )}`;
  return authUrl;
}

// Intercambia code por tokens
export async function exchangeCodeForTokens(code) {
  const body = {
    grant_type: "authorization_code",
    code,
    redirect_uri: SKY_MAVIS_REDIRECT_URI,
    client_id: SKY_MAVIS_CLIENT_ID,
  };

  const resp = await fetch(SKY_MAVIS_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-correlation-key": SKY_MAVIS_CORRELATION_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Token request failed: ${resp.statusText} → ${errText}`);
  }

  const data = await resp.json();
  return data; // { access_token, id_token, refresh_token, ... }
}
