import "dotenv/config";
import { defineConfig } from "tsup";

const define: Record<string, string> = {};

for (const key in process.env) {
  // Bypass windows errors
  if (key === "CommonProgramFiles(x86)" || key === "ProgramFiles(x86)") {
    continue;
  }
  define[`process.env.${key}`] = JSON.stringify(process.env[key]);
}

export default defineConfig({
  entry: ["./src/index.ts"],
  outExtension() {
    return { js: ".js" };
  },
  format: "esm",
  platform: "browser",
  minify: true,
  clean: true,
  define,
});
