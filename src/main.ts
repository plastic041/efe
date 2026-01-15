import { createApp } from "vue";
import App from "./App.vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import "virtual:uno.css";
import "@unocss/reset/tailwind-v4.css";

createApp(App).use(VueQueryPlugin).mount("#app");
