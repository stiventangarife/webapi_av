import express from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import User from "../models/User.js"; // tu modelo de usuario (ajusta la ruta)

const router = express.Router();

// Configuración JWKS de Sky Mavis
const client = jwksClient({
  jwksUri: "https://id.skymavis.com/.well-known/jwks.json",
});

// Función para obtener la clave pública desde el kid
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

router.get("/callback", async (req, res) => {
  try {
    const { type, data, address } = req.query;

    if (type !== "success" || !data || !address) {
      return res.status(400).json({ error: "Parámetros inválidos en la autenticación" });
    }

    // 🔹 Verificar el token recibido de Sky Mavis
    jwt.verify(data, getKey, async (err, decoded) => {
      if (err) {
        console.error("❌ Error verificando token Sky Mavis:", err);
        return res.status(401).json({ error: "Token inválido o expirado" });
      }

      if (decoded.iss !== "https://id.skymavis.com") {
        return res.status(400).json({ error: "Issuer inválido" });
      }

      console.log("✅ Token Sky Mavis verificado:", decoded);

      // 🔹 Buscar o crear usuario
      let user = await User.findOne({ wallet: address });
      if (!user) {
        user = await User.create({
          wallet: address,
          skyMavisId: decoded.sub,
          roles: decoded.roles || ["user"],
          createdAt: new Date(),
        });
        console.log("🆕 Nuevo usuario creado:", user.wallet);
      }

      // 🔹 Generar JWT interno
      const internalToken = jwt.sign(
        {
          id: user._id,
          wallet: user.wallet,
          skyMavisId: user.skyMavisId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // 🔹 Responder al cliente (Unity)
      return res.json({
        message: "Inicio de sesión exitoso con Sky Mavis",
        wallet: user.wallet,
        token: internalToken,
      });
    });
  } catch (err) {
    console.error("Error en /auth/callback:", err);
    res.status(500).json({ error: "Error procesando autenticación" });
  }
});

export default router;