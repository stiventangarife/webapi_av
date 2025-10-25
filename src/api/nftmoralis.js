// ./api/nftmoralis.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const router = express.Router(); // 🔹 usa router en vez de app

router.use(cors());
router.use(express.json());

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

router.get("/moralis", async (req, res) => {
  const { wallet, chain = "ronin", contract = "0x32950db2a7164ae833121501c797d79e7b79d74c" } = req.query;

  if (!wallet) return res.status(400).json({ error: "Missing wallet address" });

  try {
    //const url = `https://deep-index.moralis.io/api/v2.2/${wallet}/nft?chain=${chain}&format=decimal&limit=100`;
    const url = `https://deep-index.moralis.io/api/v2.2/${wallet}/nft?chain=ronin&format=decimal&token_addresses%5B0%5D=0x32950db2a7164ae833121501c797d79e7b79d74c`;

    const response = await fetch(url, {
      headers: {
        "X-API-Key": MORALIS_API_KEY,
        Accept: "application/json",
      },
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Moralis response:", response.status, text);
      return res.status(response.status).json({
        error: "Moralis API error",
        status: response.status,
        body: text,
      });
    }

    const data = await response.json();

    const filtered = contract
      ? data.result.filter(
          (nft) => nft.token_address.toLowerCase() === contract.toLowerCase()
        )
      : data.result;

    // Ahora transformamos los datos para devolver solo lo que necesites
    const simplified = filtered.map((nft) => ({
      token_id: nft.token_id
    }));

    res.json(simplified);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error calling Moralis" });
  }
});

export default router; // ✅ ahora sí existe