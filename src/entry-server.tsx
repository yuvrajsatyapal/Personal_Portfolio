import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import App from "./App";
export { publicRoutes, renderSeoHead, siteOrigin } from "./lib/seo";
export function renderPage(path: string) {
  const client = new QueryClient();
  try {
    return renderToString(<MemoryRouter initialEntries={[path]}><App client={client} /></MemoryRouter>);
  } finally { client.clear(); }
}
