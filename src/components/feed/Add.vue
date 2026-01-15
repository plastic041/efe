<script setup lang="ts">
import { ref } from "vue";
import { db } from "../../utils/db.ts";
import { useQueryClient } from "@tanstack/vue-query";

const url = ref("");

const client = useQueryClient();

async function handleSubmit() {
  const now = new Date();

  await db.execute(
    `
  INSERT INTO
    feeds
  VALUES (
    $1,
    $2
  )
  `,
    [url.value, now.toISOString()],
  );

  client.invalidateQueries({
    queryKey: ["db", "feeds"],
  });
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <label>
      <span>URL</span>
      <input type="text" v-model="url" class="border" />
    </label>
    <button>Add</button>
  </form>
</template>
