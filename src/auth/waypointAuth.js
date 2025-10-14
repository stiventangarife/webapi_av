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

// 🔹 2. Callback de autenticación
/*router.get("/callback", async (req, res) => {
  try {
    const { type, data, address } = req.query;

    if (type !== "success" || !data) {
      return res.status(400).json({ error: "Fallo en la autenticación" });
    }

    // Decodificamos el token que nos da Sky Mavis
    const decoded = jwt.decode(data, { complete: true });

    if (decoded?.payload?.iss !== "https://id.skymavis.com") {
      return res.status(400).json({ error: "Token inválido (issuer incorrecto)" });
    }

    // Usuario autenticado
    const user = {
      id: decoded.payload.sub,
      address,
      roles: decoded.payload.roles || [],
    };

    // Aquí podrías:
    // - Buscar si el usuario ya existe en tu DB (por dirección)
    // - Crear uno nuevo si no existe
    // - Luego generar tu JWT interno

    const internalToken = jwt.sign(user, SECRET, { expiresIn: "2h" });

    // 🚀 OPCIÓN 1: Responder con JSON (útil si Unity hace la llamada directa)
    return res.json({
      message: "Inicio de sesión exitoso",
      user,
      internalToken,
    });

    // 🚀 OPCIÓN 2: Redirigir a tu frontend
    // res.redirect(`https://tu-frontend.com/?token=${internalToken}`);

  } catch (err) {
    console.error("Error en /auth/callback:", err);
    res.status(500).json({ error: "Error procesando Waypoint callback" });
  }
});*/

export default router;
