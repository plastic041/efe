import { defineConfig, presetWind4, transformerVariantGroup, presetTypography } from "unocss";

export default defineConfig({
  // ...UnoCSS options
  presets: [presetWind4(), presetTypography()],
  transformers: [transformerVariantGroup()],
});
