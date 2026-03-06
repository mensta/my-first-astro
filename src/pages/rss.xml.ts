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

  return rss({
    title: config.site.title,
    description: config.metadata.meta_description,
    site: context.site,
    items: sorted.map((post: any) => ({
      title: post.data.title,
      ...(post.data.date ? { pubDate: new Date(post.data.date) } : {}),
      description: post.data.description || "",
      link: `/${post.slug}/`,
    })),
    customData: `<language>${config.site.lang || "en"}</language>`,
  });
}
