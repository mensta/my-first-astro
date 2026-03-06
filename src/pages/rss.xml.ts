import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import config from "@/config/config.json";

export async function GET(context: { site: URL }) {
  const posts = await getCollection("posts", ({ data }: { data: { draft?: boolean } }) => !data.draft);

  const sorted = posts.sort((a: any, b: any) => {
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
    return dateB - dateA;
  });

  const toDate = (raw: string | undefined): Date | undefined => {
    if (!raw) return undefined;
    // Normalize "YYYY-MM-DD HH:MM" or "YYYY-MM-DD HH:MM:SS" to strict ISO 8601
    const normalized = raw.trim().replace(
      /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})(?::(\d{2}))?$/,
      (_, d, t, s) => `${d}T${t}:${s ?? "00"}`
    );
    const date = new Date(normalized);
    return isNaN(date.getTime()) ? undefined : date;
  };

  return rss({
    title: config.site.title,
    description: config.metadata.meta_description,
    site: context.site,
    items: sorted
      .filter((post: any) => toDate(post.data.date) !== undefined)
      .map((post: any) => ({
        title: post.data.title,
        pubDate: toDate(post.data.date) as Date,
        description: post.data.description || "",
        link: `/${post.slug}/`,
      })),
    customData: `<language>${config.site.lang || "en"}</language>`,
  });
}
