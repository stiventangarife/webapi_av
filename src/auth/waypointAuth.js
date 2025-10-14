import express from "express";
import { authorize, parseRedirectUrl } from "@sky-mavis/waypoint";
import { WaypointProvider } from "@sky-mavis/waypoint";

const router = express.Router();

const {
  SKY_MAVIS_CLIENT_ID,
  SKY_MAVIS_REDIRECT_URI,
} = process.env;

// 1️⃣ Inicializamos el provider global (con tu clientId)
const waypointProvider = WaypointProvider.create({
  clientId: SKY_MAVIS_CLIENT_ID,
  chainId: 2020, // Ronin Mainnet
});

// 2️⃣ Redirige al login de Ronin (modo redirect)
router.get("/login", (req, res) => {
  const url = waypointProvider.buildAuthorizeUrl({
    mode: "redirect",
    redirectUrl: SKY_MAVIS_REDIRECT_URI,
    scopes: ["openid", "wallet"],
    state: "optional-random-state",
  });

  res.redirect(url);
});

// 3️⃣ Recibe la respuesta de Ronin después del login
router.get("/callback", async (req, res) => {
  try {
    const result = parseRedirectUrl();

    // result contiene:
    // { token, address, secondaryAddress, state }

    // Aquí podrías guardar el usuario o verificarlo
    return res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error parsing Waypoint response" });
  }
});

export default router;
