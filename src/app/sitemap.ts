import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";

const locales = ["fr", "en"];
const pages = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/convert", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/pricing", changeFrequency: "monthly" as const, priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${APP_URL}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  );
}
