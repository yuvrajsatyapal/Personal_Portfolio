import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { JSDOM } from "jsdom";

const origin = "https://yuvraj-satyapal.vercel.app";
const routes = ["/", "/projects", "/resume", "/analytics", "/support"];
const documents = new Map();
for (const route of [...routes, "/404"]) {
  const file = route === "/" ? "dist/index.html" : `dist/${route.slice(1)}.html`;
  const document = new JSDOM(await readFile(file, "utf8"), { url: new URL(route, origin).href }).window.document;
  documents.set(route, document);
  for (const selector of ["title", "meta[name='description']", "meta[name='author']", "meta[name='robots']", "meta[property='og:title']", "meta[name='twitter:card']", "script[type='application/ld+json']"]) {
    assert.equal(document.querySelectorAll(selector).length, 1, `${route}: duplicate or missing ${selector}`);
  }
  assert.equal(document.querySelectorAll("main").length, 1, `${route}: main landmark`);
  assert.equal(document.querySelectorAll("h1").length, 1, `${route}: primary H1`);
  let previous = 0;
  for (const heading of document.querySelectorAll("main h1, main h2, main h3")) {
    const level = Number(heading.tagName.slice(1));
    assert.ok(level <= previous + 1, `${route}: heading skips a level at ${heading.textContent}`);
    previous = level;
  }
  if (route === "/404") {
    assert.match(document.querySelector("meta[name='robots']").content, /noindex/);
    assert.equal(document.querySelectorAll("link[rel='canonical']").length, 0);
  } else {
    assert.equal(document.querySelectorAll("link[rel='canonical']").length, 1);
    assert.equal(document.querySelector("link[rel='canonical']").href, new URL(route, origin).href);
    assert.equal(document.querySelector("meta[property='og:url']").content, new URL(route, origin).href);
    assert.match(document.querySelector("meta[name='robots']").content, /index, follow/);
  }
  const schema = JSON.parse(document.querySelector("script[type='application/ld+json']").textContent);
  assert.equal(schema["@context"], "https://schema.org");
  const graph = schema["@graph"];
  const ids = new Set(graph.map(node => node["@id"]));
  function checkReferences(value) {
    if (!value || typeof value !== "object") return;
    if (value["@id"] && Object.keys(value).length === 1) assert.ok(ids.has(value["@id"]), `Unresolved schema ID ${value["@id"]}`);
    Object.values(value).forEach(checkReferences);
  }
  checkReferences(schema);
  assert.equal(graph.find(node => node["@type"] === "Person").name, "Yuvraj Satyapal");
  for (const image of document.querySelectorAll("img")) {
    assert.ok(image.hasAttribute("alt"), `${route}: image alt missing`);
    assert.ok(Number(image.getAttribute("width")) > 0 && Number(image.getAttribute("height")) > 0, `${route}: image dimensions missing`);
  }
  for (const asset of document.querySelectorAll("img[src], script[src], link[rel='stylesheet'], source[srcset]")) {
    const sources = asset.getAttribute("srcset")?.split(",").map(part => part.trim().split(/\s/)[0]) ?? [asset.getAttribute("src") || asset.getAttribute("href")];
    for (const source of sources) if (source?.startsWith("/")) await access(`dist${source}`);
  }
}
for (const [route, document] of documents) {
  for (const link of document.querySelectorAll("a[href]")) {
    const target = new URL(link.href);
    if (target.origin !== origin) continue;
    const other = documents.get(target.pathname);
    assert.ok(other, `${route}: broken internal route ${target.pathname}`);
    if (target.hash) assert.ok(other.getElementById(decodeURIComponent(target.hash.slice(1))), `${route}: broken anchor ${target.href}`);
  }
}
const homeText = documents.get("/").querySelector("main").textContent;
for (const text of ["Yuvraj Satyapal", "Software Engineer", "Full Stack Developer", "Delhi, India", "Arabazaar", "GGSIPU", "450+", "FlowBoard", "Trimly", "AvoChat"]) assert.ok(homeText.includes(text), `Missing crawlable profile text: ${text}`);
const sitemap = new JSDOM(await readFile("dist/sitemap.xml", "utf8"), { contentType: "text/xml" }).window.document;
assert.deepEqual([...sitemap.querySelectorAll("loc")].map(node => node.textContent), routes.map(route => new URL(route, origin).href));
const robots = await readFile("dist/robots.txt", "utf8");
assert.match(robots, /Allow: \//);
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
assert.ok(!robots.includes("Disallow: /\n"));
for (const file of ["robots.txt", "sitemap.xml"]) assert.equal(await readFile(`dist/${file}`, "utf8"), await readFile(`public/${file}`, "utf8"), `Update public/${file} to match canonical route configuration`);
console.log("SEO validation passed: metadata, canonical URLs, JSON-LD, HTML content, headings, image assets, internal links, sitemap and robots.");
