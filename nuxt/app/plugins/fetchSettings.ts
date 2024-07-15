// nuxt/app/plugins/fetchSettings.ts
import { defineNuxtPlugin, useRuntimeConfig } from "#app";
import { useSettingsStore } from "~/stores/settings";

export default defineNuxtPlugin(async (nuxtApp) => {
  const settingsStore = useSettingsStore(nuxtApp.$pinia);
  const config = useRuntimeConfig();

  try {
    const { data, error } = await useFetch(
      `${config.public.apiBase}${config.public.apiPrefix}/get_settings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          /* 可以在这里添加请求体 */
        }),
      }
    );

    if (error.value) {
      console.error("Error fetching settings:", error.value);
      return;
    }

    if (!data.value) {
      console.error("Failed to fetch settings: No data returned");
      return;
    }

    settingsStore.setSettings(data.value);
    // console.log("Settings fetched and stored:", data.value);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
  }
});
