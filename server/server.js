const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS and JSON Parsing
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const apiKey =
  process.env.GEMINI_API_KEY || "******";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.0-pro",
});

const generationConfig = {
  temperature: 0.9,
  topP: 1,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

app.post("/api/gemini", async (req, res) => {
  const { prompt } = req.body;

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    console.log("Response from Gemini API:", result); // Log the response
    res.json({ text: result.response.text() });
  } catch (error) {
    console.error("Error generating content:", error);
    console.error(
      "Error details:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Error generating content");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
