import express from "express";
import * as fhe from "./fhe.service.js";

const app = express();
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "FHE Demo API is running",
    endpoints: ["/encrypt", "/decrypt", "/add", "/multiply"]
  });
});

// Encrypt
app.post("/encrypt", async (req, res) => {
  try {
    const { value } = req.body;
    
    if (value === undefined || value === null) {
      return res.status(400).json({ error: "Value is required" });
    }
    
    if (typeof value !== "number") {
      return res.status(400).json({ error: "Value must be a number" });
    }
    
    const encrypted = await fhe.encrypt(value);
    res.json({ encrypted, originalValue: value });
  } catch (err) {
    console.error("Encryption error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Decrypt
app.post("/decrypt", async (req, res) => {
  try {
    const { cipher } = req.body;
    
    if (!cipher) {
      return res.status(400).json({ error: "Cipher is required" });
    }
    
    const value = await fhe.decrypt(cipher);
    res.json({ value });
  } catch (err) {
    console.error("Decryption error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add
app.post("/add", async (req, res) => {
  try {
    const { a, b } = req.body;
    
    if (!a || !b) {
      return res.status(400).json({ error: "Both a and b ciphers are required" });
    }
    
    const result = await fhe.add(a, b);
    res.json({ result });
  } catch (err) {
    console.error("Addition error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Multiply
app.post("/multiply", async (req, res) => {
  try {
    const { a, b } = req.body;
    
    if (!a || !b) {
      return res.status(400).json({ error: "Both a and b ciphers are required" });
    }
    
    const result = await fhe.multiply(a, b);
    res.json({ result });
  } catch (err) {
    console.error("Multiplication error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ FHE Demo API running on http://localhost:${PORT}`);
  console.log(`   GET  /            - Health check`);
  console.log(`   POST /encrypt     - Encrypt a number`);
  console.log(`   POST /decrypt     - Decrypt a cipher`);
  console.log(`   POST /add         - Add two encrypted numbers`);
  console.log(`   POST /multiply    - Multiply two encrypted numbers`);
});