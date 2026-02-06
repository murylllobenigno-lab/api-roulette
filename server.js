import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// URLs das variantes de roleta que queremos buscar
const URLS = [
  "https://api.casinoscores.com/svc-evolution-game-events/api/immersiveroulette?page=0&size=50&sort=data.settledAt,desc",
  "https://api.casinoscores.com/svc-evolution-game-events/api/classicroulette?page=0&size=50&sort=data.settledAt,desc"
];

app.get("/roulette", async (req, res) => {
  try {
    // Buscar todas as variantes em paralelo
    const resultados = await Promise.all(
      URLS.map(url => fetch(url).then(r => r.json()))
    );

    // Extrair apenas os números válidos
    let numeros = [];
    resultados.forEach(data => {
      if (data?.content) {
        const nums = data.content
          .map(e => e?.data?.result?.outcome?.number)
          .filter(n => typeof n === "number");
        numeros.push(...nums);
      }
    });

    // Manter apenas os últimos 5 números
    numeros = numeros.slice(0, 5);

    res.json({ numeros });
  } catch (e) {
    console.error("Erro API:", e);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

app.get("/", (req, res) => {
  res.send("API Roulette ONLINE - Todas variantes");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));