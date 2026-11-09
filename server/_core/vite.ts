import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { injectHtmlSeo, sendIndexHtml } from "./seo";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, injectHtmlSeo(template));
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Founding Crew was retired; send old links home.
  app.get(/^\/founding-crew\/?$/, (_req, res) => res.redirect(301, "/"));

  // Do not auto-serve index.html for "/" — we inject SEO meta ourselves.
  app.use(express.static(distPath, { index: false }));

  // fall through to index.html if the file doesn't exist
  app.use("*", (req, res) => {
    // Unknown URLs still get the app (which renders its 404 page), but with a
    // real 404 status so search engines and monitors see it correctly.
    const known = isKnownRoute(req.originalUrl.split("?")[0]);
    sendIndexHtml(res, path.resolve(distPath, "index.html"), known ? 200 : 404);
  });
}

const KNOWN_ROUTES = [
  /^\/$/,
  /^\/collections\/[\w-]+\/?$/,
  /^\/products\/[\w-]+\/?$/,
  /^\/(community|cart|returns|about|faq|shipping|contact|privacy|terms|wishlist|events)\/?$/,
  /^\/checkout\/success\/?$/,
];

function isKnownRoute(pathname: string) {
  return KNOWN_ROUTES.some(route => route.test(pathname));
}
