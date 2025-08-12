app.get("/", (_req, res) => {
  res.json({
    ok: true,
    auth0Audience: process.env.AUTH0_AUDIENCE || "não definida",
  });
});
