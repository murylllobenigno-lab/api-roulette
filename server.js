import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const API_URL =
  "https://api.casinoscores.com/svc-evolution-game-events/api/immersiveroulette?page=0&size=50&sort=data.settledAt,desc";

app.get("/roulette", async (req, res) => {
  try {
    const r = await fetch(API_URL);
    const data = await r.json();

    // Extrair apenas os números
    const numeros = data.content
      ?.map(e => e?.data?.result?.outcome?.number)
      .filter(n => typeof n === "number");

    res.json({ numeros }); // retorna { numeros: [17, 4, 22, 0, 5] }
  } catch (e) {
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

app.get("/", (req, res) => {
  res.send("API Roulette ONLINE");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));