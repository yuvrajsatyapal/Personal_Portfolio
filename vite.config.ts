import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { getAnalytics, isAnalyticsPeriod } from "./src/lib/analytics";
import { getGithub } from "./src/lib/github";
import { getLeetcode } from "./src/lib/leetcode";
import { achievements } from "./src/data/portfolio";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
  plugins: [
    react(),
    {
      name: "leetcode-api",
      configureServer(server) {
        server.middlewares.use("/api/analytics", async (req, res) => {
          res.setHeader("Content-Type", "application/json");
          const period = new URL(req.url || "/", "http://localhost").searchParams.get("period") || "7d";
          if (!isAnalyticsPeriod(period)) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Invalid analytics period" }));
            return;
          }
          try {
            const stats = await getAnalytics(period, {
              token: env.VERCEL_ANALYTICS_TOKEN,
              projectId: env.VERCEL_ANALYTICS_PROJECT_ID,
              teamId: env.VERCEL_ANALYTICS_TEAM_ID,
            });
            res.end(JSON.stringify(stats));
          } catch {
            res.statusCode = 503;
            res.end(JSON.stringify({ error: "Live analytics temporarily unavailable" }));
          }
        });
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
  };
});
