import { Hono } from "hono";
import { cors } from "hono/cors";

declare const process: { env: { USEND_VENDOR_API_KEY: string } };

const app = new Hono();

app.use("/*", cors());

app.post("/send", async (c) => {
  const apiKey = c.req.header("Authorization")?.split(" ")[1];
  if (apiKey !== process.env.USEND_VENDOR_API_KEY) {
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }

  const body = await c.req.json();
  const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  c.status(response.status);
  return c.json(data);
});

app.all("/*", (c) => {
  c.status(404);
  return c.json({ error: "Not Found" });
});

export default app;
