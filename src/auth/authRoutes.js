import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { getLoginUrl, exchangeCodeForTokens } from "./skyMavisAuth.js";

const router = express.Router();
const sessions = new Map(); // para hacer polling desde Unity (temporal)
const SECRET = process.env.SECRET;

// 1️⃣ - Redirige al login de Sky Mavis
router.get("/start", (req, res) => {
  const state = uuidv4();
  sessions.set(state, { createdAt: Date.now() });

  const loginUrl = getLoginUrl(state);
  res.redirect(loginUrl);
});

// 2️⃣ - Callback que recibe Sky Mavis
router.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) return res.status(400).send("Missing code/state");

  try {
    const tokens = await exchangeCodeForTokens(code);

    // Generamos tu propio JWT interno
    const userToken = jwt.sign(
      {
        sub: tokens.id_token, // o info decodificada del id_token
        skyMavisAccessToken: tokens.access_token,
      },
      SECRET,
      { expiresIn: "2h" }
    );

    sessions.set(state, { ready: true, token: userToken });

    res.send(`<h3>Login complete, you can close this window</h3>`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Auth failed");
  }
});

// 3️⃣ - Polling desde Unity (consulta si ya hay token)
router.get("/session", (req, res) => {
  const { state } = req.query;
  const session = sessions.get(state);

  if (!session) return res.json({ status: "pending" });

  if (session.ready) return res.json({ status: "ok", token: session.token });

  res.json({ status: "pending" });
});

export default router;
