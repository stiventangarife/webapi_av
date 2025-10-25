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

// Callback de autenticación
router.get("/callback", async (req, res) => {
  try {
    const { type, data, address } = req.query;

    if (type !== "success" || !data) {
      return res.status(400).json({ error: "Fallo en la autenticación" });
    }

    // Decodificamos el token de Sky Mavis
    const decoded = jwt.decode(data, { complete: true });

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

    console.log("Usuario autenticado:", user);

    //Responder con JSON
    return res.json({
      message: "Inicio de sesión exitoso",
      user,
    });

    //Redirigir a Unity
    //const unityRedirect = `unityapp://login-success?address=${address}&id-sky=${id}`;
    //res.redirect(unityRedirect);
  } catch (err) {
    console.error("Error en /auth/callback:", err);
    res.status(500).json({ error: "Error procesando Waypoint callback" });
  }
});

export default router;
