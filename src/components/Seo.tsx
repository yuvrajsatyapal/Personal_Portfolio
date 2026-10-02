import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { renderSeoHead } from "../lib/seo";

/** Keeps client navigation consistent with the metadata in each generated HTML page. */
export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const template = document.createElement("template");
    template.innerHTML = renderSeoHead(pathname);
    document.head.querySelectorAll("[data-seo], title, meta[name='description'], meta[name='robots'], meta[name='author'], link[rel='canonical']").forEach(node => node.remove());
    document.head.append(template.content);
  }, [pathname]);
  return null;
}
