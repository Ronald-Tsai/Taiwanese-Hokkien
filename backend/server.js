import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ping route to test server
app.get("/ping", (req, res) => res.json({ status: "ok" }));

// Translation route
app.post("/translate", async (req, res) => {
  const { text, srcLang, tgtLang } = req.body;

  if (!text || !srcLang || !tgtLang) {
    return res.status(400).json({ error: "Missing text, srcLang, or tgtLang" });
  }

  const token = process.env.HF_API_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "HF_API_TOKEN is not set" });
  }

  try {
    const response = await fetch(
    //   "https://api-inference.huggingface.co/models/facebook/nllb-200-distilled-600M",
      "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-ROMANCE",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: text,
          parameters: { src_lang: srcLang, tgt_lang: tgtLang },
        }),
      }
    );

    // Handle non-200 responses
    if (!response.ok) {
      const textBody = await response.text();
      console.error("HF API returned non-200:", response.status, textBody);
      return res
        .status(response.status)
        .json({ error: `Hugging Face API error: ${textBody}` });
    }

    // Try parsing JSON
    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.error("Failed to parse HF API response as JSON:", err);
      return res.status(500).json({ error: "Invalid JSON from Hugging Face API" });
    }

    // Extract translation
    let translation = "";
    if (Array.isArray(data) && data[0]?.translation_text) {
      translation = data[0].translation_text;
    } else if (data.translation_text) {
      translation = data.translation_text;
    } else {
      translation = "Translation unavailable";
    }

    res.json({ translation });
  } catch (err) {
    console.error("Hugging Face API call failed:", err);
    res.status(500).json({ error: "Failed to fetch translation" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
