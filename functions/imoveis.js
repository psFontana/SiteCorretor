// Install dependencies: express, express-oauth2-jwt-bearer, serverless-http
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const { auth } = require("express-oauth2-jwt-bearer");
const fs = require("fs").promises;
const path = require("path");

const app = express();
app.use(bodyParser.json());

// Middleware de validação do JWT
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: "RS256",
});

app.use(jwtCheck);

// GET /api/imoveis
app.get("/imoveis", async (_, res) => {
  const data = await fs.readFile(
    path.join(__dirname, "../imoveis.json"),
    "utf8"
  );
  return res.json(JSON.parse(data));
});

// POST /api/imoveis (criar)
app.post("/imoveis", async (req, res) => {
  const imovel = req.body;
  const filePath = path.join(__dirname, "../imoveis.json");
  const raw = await fs.readFile(filePath, "utf8");
  const arr = JSON.parse(raw);
  arr.push(imovel);
  await fs.writeFile(filePath, JSON.stringify(arr, null, 2));
  res.status(201).json(imovel);
});

// PUT /api/imoveis/:id (atualizar)
app.put("/imoveis/:id", async (req, res) => {
  const id = Number(req.params.id);
  const updates = req.body;
  const filePath = path.join(__dirname, "../imoveis.json");
  const arr = JSON.parse(await fs.readFile(filePath, "utf8"));
  const idx = arr.findIndex((i) => i.id === id);
  if (idx < 0) return res.status(404).json({ error: "Imóvel não encontrado" });
  arr[idx] = { ...arr[idx], ...updates };
  await fs.writeFile(filePath, JSON.stringify(arr, null, 2));
  res.json(arr[idx]);
});

// DELETE /api/imoveis/:id
app.delete("/imoveis/:id", async (req, res) => {
  const id = Number(req.params.id);
  const filePath = path.join(__dirname, "../imoveis.json");
  let arr = JSON.parse(await fs.readFile(filePath, "utf8"));
  arr = arr.filter((i) => i.id !== id);
  await fs.writeFile(filePath, JSON.stringify(arr, null, 2));
  res.status(204).end();
});

module.exports.handler = serverless(app);
