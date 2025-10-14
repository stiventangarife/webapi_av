import React from "react";
import { authorize, parseRedirectUrl } from "@sky-mavis/waypoint";

export default function Login() {
  const handleLogin = async () => {
    // Inicia el flujo de autenticación con Waypoint
    await authorize({
      mode: "popup",
      clientId: "dcc7811a-d50e-4c82-87dd-c016318bd38f", // tu clientId real
      redirectUrl: "https://webapi-av.onrender.com/", // o tu dominio real en producción
      scopes: ["openid", "wallet"],
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>Iniciar sesión con Ronin Waypoint</h1>
      <button onClick={handleLogin} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Conectar con Ronin Wallet
      </button>
    </div>
  );
}
