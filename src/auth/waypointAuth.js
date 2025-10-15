import express from "express";
import jwt from "jsonwebtoken";
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

// 🔹 2. Callback de autenticación
router.get("/callback", async (req, res) => {
  try {
    console.error("Query ", req.query);
    const { type, data, address } = req.query;

    if (type !== "success" || !data) {
      console.warn("❌ Autenticación fallida o incompleta:", req.query);
      return res.status(400).json({ error: "Fallo en la autenticación" });
    }

    // Decodificamos el token que nos da Sky Mavis
    const decoded = jwt.decode(data, { complete: true });
    console.log("🔍 Token decodificado:", decoded);

    if (!decoded) {
      throw new Error("No se pudo decodificar el token JWT recibido");
    }

    if (decoded?.payload?.iss !== "https://id.skymavis.com") {
      throw new Error(`Issuer inválido: ${decoded?.payload?.iss}`);
    }

    // Usuario autenticado
    const user = {
      id: decoded.payload.sub,
      address,
      roles: decoded.payload.roles || [],
    };

    console.log("✅ Usuario autenticado:", user);
    // Aquí podrías:
    // - Buscar si el usuario ya existe en tu DB (por dirección)
    // - Crear uno nuevo si no existe
    // - Luego generar tu JWT interno

    // 🚀 OPCIÓN 1: Responder con JSON (útil si Unity hace la llamada directa)
    return res.json({
      message: "Inicio de sesión exitoso",
      user,
    });

    // 🚀 OPCIÓN 2: Redirigir a tu frontend
    // res.redirect(`https://tu-frontend.com/?token=${internalToken}`);

  } catch (err) {
    console.error("Error en /auth/callback:", err);
    res.status(500).json({ error: "Error procesando Waypoint callback" });
  }
});

export default router;
