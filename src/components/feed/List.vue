<script setup lang="ts">
import { db, useFeeds } from "../../utils/db.ts";
import { parseFeed } from "@rowanmanning/feed-parser";
import { useQueryClient } from "@tanstack/vue-query";
import { fetch } from "@tauri-apps/plugin-http";
import dayjs from "dayjs";

const { data: feeds } = useFeeds();

const client = useQueryClient();

const selectedFeedUrl = defineModel<string | null>("selectedFeedUrl");

async function handleSelect(feed: { url: string; lastFetchedAt: string }) {
  const now = dayjs();
  // Threshold is 30 minutes
  const threshold = now.subtract(30, "minutes");

  if (dayjs(feed.lastFetchedAt).isBefore(threshold)) {
    const res = await fetch(feed.url);

    if (!res.ok) {
      return;
    }

    const now = new Date();
    db.execute(
      `
      UPDATE feeds
      SET lastFetchedAt = $1
      WHERE url = $2
      `,
      [now, feed.url],
    );
    const text = await res.text();
    const parsed = parseFeed(text);

    await Promise.all(
      parsed.items.map(item => {
        db.execute(
          `
          INSERT into articles
          VALUES ($1, $2, $3, $4, $5, $6);
          `,
          [item.url, item.title, item.content, item.description, item.published, feed.url],
        );

      })
    )

    client.invalidateQueries({
      queryKey: ["db", "articles", feed.url],
    });
  }


  selectedFeedUrl.value = feed.url;
}
</script>

<template>
  <h2 class="text-xl">Feeds</h2>

  <ul v-if="feeds">
    <li v-for="feed in feeds">
      <button
        class="text-start data-[selected=true]:bg-yellow-300 cursor-pointer hover:data-[selected=false]:bg-yellow-100"
        @click="handleSelect(feed)" :data-selected="selectedFeedUrl === feed.url">
        <dl class="flex flex-col gap-4">
          <span>{{ feed.url }}</span>

          <!-- <div>
            <dt>Last Fetched At</dt>
            <dd>
              <time :datetime="feed.lastFetchedAt"> {{ feed.lastFetchedAt }} </time>
            </dd>
          </div> -->
        </dl>
      </button>
    </li>
  </ul>
</template>
