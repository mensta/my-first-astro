import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import AutoImport from "astro-auto-import";
import { defineConfig, squooshImageService } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import remarkLinkCardKai from "remark-link-card-kai";
import partytown from "@astrojs/partytown";
import config from "./src/config/config.json";
import remarkDirective from "remark-directive";
import { remarkAdmonition, DEFAULT_ADMONITION_TYPES } from "remark-alert-kai";
import lazyLoadPlugin from "rehype-plugin-image-native-lazy-loading";

// アラート記法(:::note など)の種類。`types` を渡すと既定の種類(note / tip / warning / danger)が
// 置き換わるため、既定を引き継いだうえで important と caution を足す。
// `:::info` は登録していない(描画されない)。
const admonitionTypes = new Map([
  ...DEFAULT_ADMONITION_TYPES,
  ["important", { defaultLabel: "Important" }],
  ["caution", { defaultLabel: "Caution" }],
]);

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  image: config.settings.disable_image_optimization ? undefined : {
    service: squooshImageService(),
  },
  integrations: [
    react(),
    sitemap(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
      ],
    }),
    mdx(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    (await import("astro-compress")).default({
      CSS: false,
      HTML: config.settings.disable_html_compression ? false : {
        "html-minifier-terser": {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: false,
      SVG: false,
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      remarkDirective,
      [remarkAdmonition, { types: admonitionTypes }],
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
      [
        remarkLinkCardKai,
        {
          cache: true,
          shortenUrl: true,
        },
      ],
    ],
    rehypePlugins: [
      lazyLoadPlugin
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});
