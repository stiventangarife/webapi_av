import express from "express";
import { WaypointProvider } from "@sky-mavis/waypoint";

const router = express.Router();

const {
  SKY_MAVIS_CLIENT_ID,
  SKY_MAVIS_REDIRECT_URI,
} = process.env;

// Inicializamos el provider global (con tu clientId)
const waypointProvider = WaypointProvider.create({
  clientId: SKY_MAVIS_CLIENT_ID,
  chainId: 2020, // Ronin Mainnet
});

// Redirige al login de Ronin (modo redirect)
router.get("/login", (req, res) => {
  const url = waypointProvider.buildAuthorizeUrl({
    mode: "redirect",
    redirectUrl: SKY_MAVIS_REDIRECT_URI,
    scopes: ["openid", "wallet"],
    state: "optional-random-state",
  });

  res.redirect(url);
});

/*router.get("/callback", async (req, res) => {
  try {
    console.log("🔹 Query params:", req.query);
    console.log("🔹 Full URL:", `${req.protocol}://${req.get("host")}${req.originalUrl}`);

    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    // No usar parseRedirectUrl() todavía
    // Vamos a inspeccionar primero qué trae el callback
    res.json({
      message: "Datos recibidos desde Sky Mavis",
      query: req.query,
      fullUrl,
    });
  } catch (err) {
    console.error("Error en /auth/callback:", err);
    res.status(500).json({ error: "Error procesando Waypoint callback" });
  }
});*/

export default router;
