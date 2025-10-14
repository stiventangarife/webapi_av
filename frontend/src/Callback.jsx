import React, { useEffect } from "react";
import { parseRedirectUrl } from "@sky-mavis/waypoint";

export default function Callback() {
  useEffect(() => {
    const result = parseRedirectUrl();
    console.log("Resultado de Waypoint:", result);

    // Enviar el token al backend para validarlo o crear sesión
    fetch("https://webapi-av.onrender.com/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Respuesta del backend:", data);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  return <h2>Procesando inicio de sesión...</h2>;
}
