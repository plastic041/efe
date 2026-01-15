import Database from "@tauri-apps/plugin-sql";
import { useQuery } from "@tanstack/vue-query";
import { MaybeRefOrGetter, toValue } from "vue";

const db = await Database.load("sqlite:main.db");
await db.execute(`
  CREATE TABLE IF NOT EXISTS
    feeds (
      url TEXT PRIMARY KEY NOT NULL,
      lastFetchedAt DATE NOT NULL
    );
  `);

await db.execute(`
  CREATE TABLE IF NOT EXISTS
    articles (
      url TEXT PRIMARY KEY NOT NULL,
      title TEXT,
      content TEXT,
      description TEXT,
      published DATE,
      feedUrl TEXT NOT NULL,
      FOREIGN KEY (feedUrl) REFERENCES feeds(url)
    );
  `);

export { db };

export function useFeeds() {
  return useQuery({
    queryKey: ["db", "feeds"],
    queryFn: async () => {
      const feeds = await db.select<{ url: string; lastFetchedAt: string }[]>(`
        SELECT * FROM feeds;
        `);

      return feeds;
    },
  });
}

export function useArticles(feedUrl: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ["db", "articles", feedUrl],
    queryFn: async () => {
      // title TEXT,
      // content TEXT,
      // description TEXT,
      // feedUrl TEXT NOT NULL,
      const articles = await db.select<
        {
          url: string;
          title: string | null;
          content: string | null;
          description: string | null;
          feedUrl: string;
          published: Date | null;
        }[]
      >(
        `
        SELECT *
        FROM articles
        WHERE feedUrl = $1
        ORDER BY published DESC;
        `,
        [toValue(feedUrl)],
      );

      return articles;
    },
  });
}
