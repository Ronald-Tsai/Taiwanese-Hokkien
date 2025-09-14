import { useState } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText) return;
    setLoading(true);
    try {
      const res = await fetch("https://hokkien-backend.onrender.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          srcLang: "eng_Latn",
          tgtLang: "nan_Latn",
        }),
      });

      const data = await res.json();
      setOutputText(data.translation || "Translation not available yet");
    } catch (err) {
      console.error(err);
      setOutputText("Error translating text");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: "20px",
        fontFamily: "sans-serif",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Taiwanese Hokkien Translator</h1>

      <textarea
        rows={4}
        placeholder="Type English text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "90%",
          maxWidth: "600px",
          resize: "vertical",
        }}
      />

      <button
        onClick={handleTranslate}
        style={{
          marginTop: "15px",
          padding: "10px 25px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#0070f3",
          color: "white",
          width: "90%",
          maxWidth: "200px",
        }}
        disabled={loading}
      >
        {loading ? "Translating..." : "Translate"}
      </button>

      <div
        style={{
          marginTop: "25px",
          fontSize: "18px",
          fontWeight: "bold",
          minHeight: "50px",
          width: "90%",
          maxWidth: "600px",
          wordWrap: "break-word",
        }}
      >
        {outputText}
      </div>
    </div>
  );
}

export default App;
