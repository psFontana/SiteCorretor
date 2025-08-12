const express = require("express");
const serverless = require("serverless-http");

const app = express();

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    auth0Audience: process.env.AUTH0_AUDIENCE || "não definida",
  });
});

module.exports.handler = serverless(app);
