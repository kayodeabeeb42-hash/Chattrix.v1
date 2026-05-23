import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.log("GEMINI_API_KEY is not defined. Chattrix AI will operate in beautiful local simulation mode.");
}

// API endpoint for Chattrix AI assistant
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages outline provided" });
    }

    if (!ai) {
      // Simulate clever AI response locally if key is missing
      const lastMsgText = messages[messages.length - 1]?.text || "";
      let mockReply = "Hello there! I'm Chattrix AI. Your workspace hasn't fully configured my GEMINI_API_KEY secret yet, so I'm currently scanning a localized sub-space network. How can I assist you in this sandbox today?";
      
      if (lastMsgText.toLowerCase().includes("encrypt") || lastMsgText.toLowerCase().includes("secure")) {
        mockReply = "Chattrix utilizes ultra-grade, quantum-resistant end-to-end encryption. Each chat generates unique DH ephemeral keys that seal text, media, and voice notes so that only you and your contact hold the keycards.";
      } else if (lastMsgText.toLowerCase().includes("help") || lastMsgText.toLowerCase().includes("features")) {
        mockReply = "I can guide you through Chattrix: you can experience full one-to-one chats, simulated voice/video calls with live canvas capture, Updates/Channels, unified Communities, or adjust custom Dark Theme assets!";
      } else if (lastMsgText.toLowerCase().includes("hello") || lastMsgText.toLowerCase().includes("hi")) {
        mockReply = "Greetings, agent! Welcome to Chattrix, the ultimate cyber-comms deck. I'm ready to decode any query. Give me a command!";
      } else {
        mockReply = `Received transmission: "${lastMsgText}". Under normal conditions, Gemini-3.5-Flash would process this instantly. To activate my supreme intelligence, add your GEMINI_API_KEY inside the Settings > Secrets menu!`;
      }
      
      return setTimeout(() => {
        res.json({ text: mockReply });
      }, 700);
    }

    // Prepare contents properly for the GenAI SDK
    // Map previous conversation messages to actual Gemini part system
    // We take the last 8 messages for context to stay lightweight
    const conversationHistory = messages.slice(-8).map((msg: any) => {
      return {
        role: msg.sender === "me" ? "user" : "model",
        parts: [{ text: msg.text || "" }]
      };
    });

    const systemPrompt = `You are Chattrix AI, a custom advanced built-in intelligence embedded in the Chattrix messaging app.
Chattrix is a next-generation communication platform featuring glassmorphism, glowing slate cyber layouts, file transceivers, soundwave recorders, and real-time audio-video relays.
Keep your answers sleek, cyber-themed, concise, and helpful. Answer in clean Markdown, using bullets or brief paragraphs when detailing features. Be friendly and witty.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: conversationHistory,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.85
      }
    });

    res.json({ text: response.text || "Transmission error. My AI quantum relay was disrupted, try again." });
  } catch (err: any) {
    console.error("Gemini API Error in /api/chat:", err);
    res.status(500).json({ error: err.message || "An internal AI uplink error occurred." });
  }
});

// Setup server with Vite Dev middleware support
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Chattrix Server booted on port ${PORT}`);
  });
}

startServer();
