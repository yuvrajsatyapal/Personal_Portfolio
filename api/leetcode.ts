import { getLeetcode } from "../src/lib/leetcode.js";
import { achievements } from "../src/data/portfolio.js";
interface Response {
  status: (code: number) => Response;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}
export default async function handler(_request: unknown, response: Response) {
  try {
    const stats = await getLeetcode(achievements.leetcodeUsername);
    response.setHeader(
      "Cache-Control",
      "s-maxage=1800, stale-while-revalidate=3600",
    );
    response.status(200).json(stats);
  } catch {
    response
      .status(503)
      .json({ error: "Live LeetCode data is temporarily unavailable" });
  }
}
