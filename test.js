import fetch from "node-fetch";

async function testServer() {
  try {
    const response = await fetch("http://localhost:5000/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "Hello",
        srcLang: "eng_Latn",
        tgtLang: "nan_Latn",
      }),
    });

    const data = await response.json();
    console.log("Server response:", data);
  } catch (err) {
    console.error("Error connecting to server:", err);
  }
}

testServer();
