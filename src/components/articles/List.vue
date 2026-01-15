<script setup lang="ts">
import { useArticles } from "../../utils/db.ts";
import DOMPurify from "dompurify"

const props = defineProps<{
  feedUrl: string;
}>();

const { data: articles } = useArticles(() => props.feedUrl);
</script>

<template>
  <ul class='flex flex-col gap-4'>
    <li v-for="article in articles" key="article.url">
      <a :href="article.url" target="_blank">
        {{ article.title }}
      </a>

      <div class="prose" v-if="article.description"
        v-html="DOMPurify.sanitize(article.description, { USE_PROFILES: { html: true } })" /> -->

      <!-- 
      <div class="prose" v-if="article.content"
        v-html="DOMPurify.sanitize(article.content, { USE_PROFILES: { html: true } })" /> -->
    </li>
  </ul>
</template>
