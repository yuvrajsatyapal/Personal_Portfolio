export type CalendarData = Record<string, { count: number; level: number }>;
export interface CalendarDay {
  date: string;
  count: number;
  level: number;
}
export function buildCalendar(calendar: CalendarData, end: Date = new Date()) {
  const last = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));
  const first = new Date(last);
  first.setUTCFullYear(first.getUTCFullYear() - 1);
  first.setUTCDate(first.getUTCDate() + 1);
  const days: (CalendarDay | null)[] = Array.from(
    { length: first.getUTCDay() },
    () => null,
  );
  const months: { label: string; column: number }[] = [];
  let total = 0;
  for (
    let date = new Date(first);
    date <= last;
    date.setUTCDate(date.getUTCDate() + 1)
  ) {
    const iso = date.toISOString().slice(0, 10);
    const entry = calendar[iso] || { count: 0, level: 0 };
    if (date.getUTCDate() === 1 || date.getTime() === first.getTime()) {
      const month = {
        label: date.toLocaleString("en-US", {
          month: "short",
          timeZone: "UTC",
        }),
        column: Math.floor(days.length / 7),
      };
      if (months.at(-1)?.column === month.column)
        months[months.length - 1] = month;
      else months.push(month);
    }
    days.push({ date: iso, count: entry.count, level: entry.level });
    total += entry.count;
  }
  while (days.length % 7) days.push(null);
  return { days, months, total };
}
