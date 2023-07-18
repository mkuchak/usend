import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchDkimData } from "./utils/fetchDkimData";
import { fetchSendEmail } from "./utils/fetchSendEmail";
import { validateKeyPair } from "./utils/validateKeyPair";

declare const process: { env: { USEND_VENDOR_API_KEY: string } };

const app = new Hono();

app.use("/*", cors());

app.post("/send", async (c) => {
  const apiKey = c.req.header("Authorization")?.split(" ")[1];

  if (apiKey !== process.env.USEND_VENDOR_API_KEY) {
    c.status(401);
    return c.json({ errors: ["unauthorized - invalid API key"] });
  }

  const body = await c.req.json();

  const dkimDomain = body.from?.email?.split("@")[1];
  const dkimSelector = "mailchannels";
  const dkimPrivateKey = body.personalizations[0]?.dkim_private_key || "";

  const dkimData = await fetchDkimData(dkimDomain, dkimSelector);
  const dkimVersion = dkimData?.v;
  const dkimPublicKey = dkimData?.p;

  if (dkimVersion && dkimPublicKey) {
    if (dkimVersion !== "DKIM1") {
      c.status(400);
      return c.json({ errors: ["bad request - invalid DKIM version"] });
    }

    if (!dkimPrivateKey) {
      c.status(400);
      return c.json({
        errors: ["bad request - DKIM private key is required"],
      });
    }

    const isValidKeyPair = await validateKeyPair(dkimPublicKey, dkimPrivateKey);

    if (!isValidKeyPair) {
      c.status(400);
      return c.json({
        errors: ["bad request - DKIM public key and private key mismatch"],
      });
    }
  }

  const { status, data } = await fetchSendEmail(body);

  c.status(status);
  return c.json(data);
});

app.all("/*", (c) => {
  c.status(404);
  return c.json({ error: "Not Found" });
});

export default app;
