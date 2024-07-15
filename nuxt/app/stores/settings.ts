// nuxt/app/stores/settings.ts
import { defineStore } from "pinia";

interface Settings {
  Web_Title: string;
  Web_Description: string;
  Web_URL: string;
  Web_Logo: string;
  Dify_Api: string;
  Dify_Token: string;
}

export const useSettingsStore = defineStore("settings", {
  state: (): { settings: Settings } => ({
    settings: {
      Web_Title: "",
      Web_Description: "",
      Web_URL: "",
      Web_Logo: "",
      Dify_Api: "",
      Dify_Token: "",
    },
  }),
  actions: {
    setSettings(settings: Settings) {
      this.settings = settings;
    },
  },
});
