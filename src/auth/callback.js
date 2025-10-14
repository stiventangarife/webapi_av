import jwt from "jsonwebtoken";
import express from "express";

const router = express.Router();

router.get("/callback", async (req, res) => {
  try {
    const { type, data, address, state } = req.query;

    if (type !== "success" || !data) {
      return res.status(400).json({ error: "Fallo en la autenticación" });
    }

    // 🔹 Decodificar el JWT (sin verificar firma todavía)
    const decoded = jwt.decode(data, { complete: true });

    console.log("🔸 Token decodificado:", decoded);

    // 🔹 Aquí podrías validar `iss` y `aud` si quieres mayor seguridad
    if (decoded?.payload?.iss !== "https://id.skymavis.com") {
      return res.status(400).json({ error: "Token inválido (issuer incorrecto)" });
    }

    // 🔹 Datos del usuario
    const user = {
      id: decoded.payload.sub,
      address,
      roles: decoded.payload.roles || [],
      scopes: decoded.payload.scp,
    };

    console.log("✅ Usuario autenticado:", user);

    // 🔹 Opcional: generar tu propio token interno
    const internalToken = jwt.sign(user, process.env.SECRET, { expiresIn: "2h" });

    // 🔹 Respuesta final
    return res.json({
      message: "Inicio de sesión exitoso",
      user,
      internalToken,
    });

  } catch (err) {
    console.error("❌ Error en /auth/callback:", err);
    res.status(500).json({ error: "Error procesando Waypoint callback" });
  }
});

export default router;
