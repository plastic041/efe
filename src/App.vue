<script setup lang="ts">
import ArticleList from "./components/articles/List.vue";
import FeedList from "./components/feed/List.vue";
import FeedAdd from "./components/feed/Add.vue";
import { ref } from "vue";

const selectedFeedUrl = ref<string | null>(null);
</script>

<template>
  <div class="grid grid-cols-3">
    <div>
      <FeedAdd />
      <FeedList v-model:selected-feed-url="selectedFeedUrl" />
    </div>
    <div>
      <ArticleList v-if="selectedFeedUrl" :feed-url="selectedFeedUrl" />
    </div>
  </div>
</template>
