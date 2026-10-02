import { describe, expect, it } from "vitest";
import { getSeo, getStructuredData, publicRoutes, renderSeoHead } from "../src/lib/seo";

describe("portfolio SEO", () => {
  it("uses the configured production domain and one canonical per route", () => {
    expect(getSeo("/home").canonical).toBe("https://yuvraj-satyapal.vercel.app/");
    for (const path of publicRoutes) {
      const page = getSeo(path);
      expect(page.canonical).toBe(new URL(path, "https://yuvraj-satyapal.vercel.app").href);
      expect(page.title).toContain("Yuvraj Satyapal");
      expect(renderSeoHead(path).match(/rel="canonical"/g)).toHaveLength(1);
    }
    expect(new Set(publicRoutes.map(path => getSeo(path).title)).size).toBe(publicRoutes.length);
    expect(getSeo("/missing").robots).toContain("noindex");
  });
  it("connects the official profile, website and real public accounts", () => {
    const graph = getStructuredData("/")["@graph"];
    const person = graph.find(node => node["@type"] === "Person")!;
    expect(person.name).toBe("Yuvraj Satyapal");
    expect(person.sameAs).toEqual(expect.arrayContaining([
      "https://github.com/yuvrajsatyapal", "https://leetcode.com/u/yuvraj_satyapal/",
      "https://www.linkedin.com/in/yuvraj-satyapal",
    ]));
    expect(person.knowsAbout).toEqual(expect.arrayContaining(["React", "Next.js", "SQL", "REST APIs"]));
    const page = graph.find(node => node["@type"] === "ProfilePage")!;
    expect(page.mainEntity).toEqual({ "@id": person["@id"] });
    expect(JSON.parse(JSON.stringify(getStructuredData("/")))["@context"]).toBe("https://schema.org");
  });
});
