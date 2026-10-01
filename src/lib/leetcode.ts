export interface LeetcodeStats {
  attempting?: number;
  total: number;
  easy: number;
  medium: number;
  hard: number;
  calendar: Record<string, number>;
  available?: { total: number; easy: number; medium: number; hard: number };
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("LeetCode data unavailable");
  return value as Record<string, unknown>;
}
export function normalizeLeetcode(data: unknown): LeetcodeStats {
  const user = object(object(data).matchedUser);
  const stats = object(user.submitStatsGlobal).acSubmissionNum;
  if (!Array.isArray(stats)) throw new Error("LeetCode counts unavailable");
  const count = (difficulty: string) => {
    const row = stats.map(object).find((s) => s.difficulty === difficulty);
    if (
      !row ||
      typeof row.count !== "number" ||
      !Number.isFinite(row.count) ||
      row.count < 0
    )
      throw new Error("Invalid LeetCode counts");
    return row.count;
  };
  const raw = object(user.userCalendar).submissionCalendar;
  if (typeof raw !== "string") throw new Error("LeetCode calendar unavailable");
  const parsed = object(JSON.parse(raw));
  const calendar: Record<string, number> = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0 &&
      /^\d+$/.test(key)
    )
      calendar[key] = value;
  }
  const catalog = object(data).allQuestionsCount;
  let available: LeetcodeStats["available"];
  if (Array.isArray(catalog)) {
    const rows = catalog.map(object);
    const countFor = (difficulty: string) => rows.find(row => row.difficulty === difficulty)?.count;
    const values = ["All", "Easy", "Medium", "Hard"].map(countFor);
    if (values.every(value => typeof value === "number" && Number.isFinite(value) && value >= 0)) {
      const [total, easy, medium, hard] = values as number[];
      available = { total, easy, medium, hard };
    }
  }
  const attemptedRows = object(user.submitStatsGlobal).totalSubmissionNum;
  const attempted = Array.isArray(attemptedRows) ? attemptedRows.map(object).find(row => row.difficulty === "All")?.count : undefined;
  const attempting = typeof attempted === "number" && Number.isFinite(attempted) && attempted >= count("All") ? attempted - count("All") : undefined;
  return {
    ...(attempting === undefined ? {} : { attempting }),
    ...(available ? { available } : {}),
    total: count("All"),
    easy: count("Easy"),
    medium: count("Medium"),
    hard: count("Hard"),
    calendar,
  };
}
export async function getLeetcode(username: string): Promise<LeetcodeStats> {
  if (!/^[a-zA-Z0-9_-]{1,40}$/.test(username))
    throw new Error("Invalid username");
  const response = await fetch("https://leetcode.com/graphql/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query:
        "query Portfolio($username:String!){allQuestionsCount{difficulty count} matchedUser(username:$username){submitStatsGlobal{totalSubmissionNum{difficulty count} acSubmissionNum{difficulty count}} userCalendar{ submissionCalendar }}}",
      variables: { username },
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("LeetCode is temporarily unavailable");
  const result = object(await response.json());
  return normalizeLeetcode(result.data);
}
