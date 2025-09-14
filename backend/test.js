import fetch from "node-fetch";

async function testTranslate() {
  const res = await fetch("http://localhost:5000/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: "Hello",
      srcLang: "eng_Latn",
      tgtLang: "nan_Latn",
    }),
  });

  const data = await res.json();
  console.log("Response from backend:", data);
}

testTranslate();
