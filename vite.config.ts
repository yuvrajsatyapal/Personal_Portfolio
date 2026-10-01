import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { getGithub } from "./src/lib/github";
import { getLeetcode } from "./src/lib/leetcode";
import { achievements } from "./src/data/portfolio";
export default defineConfig({
  plugins: [
    react(),
    {
      name: "leetcode-api",
      configureServer(server) {
        server.middlewares.use("/api/github", async (_req, res) => {
          try {
            const stats = await getGithub(achievements.githubUsername);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(stats));
          } catch {
            res.statusCode = 503;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: "Live GitHub data temporarily unavailable",
              }),
            );
          }
        });
        server.middlewares.use("/api/leetcode", async (_req, res) => {
          try {
            const stats = await getLeetcode(achievements.leetcodeUsername);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(stats));
          } catch {
            res.statusCode = 503;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: "Live LeetCode data temporarily unavailable",
              }),
            );
          }
        });
      },
    },
  ],
  test: { environment: "jsdom", setupFiles: ["./tests/setup.ts"] },
});
