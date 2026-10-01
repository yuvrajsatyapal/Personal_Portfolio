import { describe, it, expect } from "vitest";
import { normalizeLeetcode } from "../src/lib/leetcode";
describe("live LeetCode data", () => {
  it("uses the live solved counts and submission calendar", () => {
    expect(
      normalizeLeetcode({
        matchedUser: {
          submitStatsGlobal: {
            acSubmissionNum: [
              { difficulty: "All", count: 512 },
              { difficulty: "Easy", count: 180 },
              { difficulty: "Medium", count: 280 },
              { difficulty: "Hard", count: 52 },
            ],
          },
          userCalendar: { submissionCalendar: '{"1760000000":3}' },
        },
      }),
    ).toEqual({
      total: 512,
      easy: 180,
      medium: 280,
      hard: 52,
      calendar: { "1760000000": 3 },
    });
  });
  it("normalizes live catalog totals and attempted-but-unsolved problems", () => {
    const result = normalizeLeetcode({
      allQuestionsCount: [{difficulty:"All",count:4069},{difficulty:"Easy",count:968},{difficulty:"Medium",count:2122},{difficulty:"Hard",count:979}],
      matchedUser: {
        submitStatsGlobal: {
          acSubmissionNum: [{difficulty:"All",count:471},{difficulty:"Easy",count:275},{difficulty:"Medium",count:179},{difficulty:"Hard",count:17}],
          totalSubmissionNum: [{difficulty:"All",count:473}],
        },
        userCalendar: { submissionCalendar: "{}" },
      },
    });
    expect(result.available).toEqual({total:4069,easy:968,medium:2122,hard:979});
    expect(result.attempting).toBe(2);
  });
  it("rejects unavailable profiles instead of returning invented counts", () => {
    expect(() => normalizeLeetcode({ matchedUser: null })).toThrow();
  });
});
