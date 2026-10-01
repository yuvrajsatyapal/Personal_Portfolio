import type { CalendarData } from "./calendar";
export interface GithubStats {
  calendar: CalendarData;
}
export function parseGithubCalendar(html: string): GithubStats {
  const counts = new Map<string, number>();
  const attribute = (tag: string, name: string) =>
    tag.match(new RegExp("\\b" + name + '="([^"]*)"'))?.[1];
  for (const match of html.matchAll(
    /<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g,
  )) {
    const id = attribute(match[1], "for");
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    const count = text.match(/^(No|[\d,]+) contributions?\b/);
    if (id && count)
      counts.set(
        id,
        count[1] === "No" ? 0 : Number(count[1].replaceAll(",", "")),
      );
  }
  const calendar: CalendarData = {};
  for (const match of html.matchAll(
    /<(?:td|rect)\b[^>]*\bdata-date="\d{4}-\d{2}-\d{2}"[^>]*>/g,
  )) {
    const tag = match[0];
    const date = attribute(tag, "data-date")!;
    const id = attribute(tag, "id");
    const level = Number(attribute(tag, "data-level"));
    const count = id ? counts.get(id) : undefined;
    if (
      count === undefined ||
      !Number.isInteger(level) ||
      level < 0 ||
      level > 4
    )
      throw new Error("Incomplete GitHub contribution data");
    calendar[date] = { count, level };
  }
  if (!Object.keys(calendar).length)
    throw new Error("GitHub contribution data unavailable");
  return { calendar };
}
export async function getGithub(username: string): Promise<GithubStats> {
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username))
    throw new Error("Invalid GitHub username");
  const response = await fetch(
    "https://github.com/users/" + username + "/contributions",
    { headers: { Accept: "text/html" }, signal: AbortSignal.timeout(10000) },
  );
  if (!response.ok) throw new Error("GitHub is temporarily unavailable");
  return parseGithubCalendar(await response.text());
}
