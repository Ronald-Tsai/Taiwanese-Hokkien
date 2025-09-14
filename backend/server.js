const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/translate", async (req, res) => {
  const { text, srcLang, tgtLang } = req.body;

  if (!text || !srcLang || !tgtLang) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/nllb-200-3.3B",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: text,
          parameters: { src_lang: srcLang, tgt_lang: tgtLang },
        }),
      }
    );

    const data = await response.json();
    const translation = data?.translation_text || data?.[0]?.translation_text || "";

    res.json({ translation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to translate text" });
  }
});

app.post("/test", (req, res) => {
  const { text } = req.body;
  console.log("Received from frontend:", text);
  res.json({ receivedText: text || "No text sent" });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
