import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/verify", async (req, res) => {
  try {
    const { token, address } = req.body;

    if (!token) return res.status(400).json({ error: "Token faltante" });

    // Aquí podrías validar el token si Sky Mavis provee endpoint o usarlo directamente
    console.log("Usuario autenticado:", address);

    // Crear sesión o JWT interno de tu API
    return res.json({ message: "Inicio de sesión exitoso", address });
  } catch (error) {
    console.error("Error verificando token:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
