import "i18next";

import about from "./en/about.json";
import common from "./en/common.json";
import contribute from "./en/contribute.json";
import dashboard from "./en/dashboard.json";
import home from "./en/home.json";
import martyrPage from "./en/martyrPage.json";
import martyrsList from "./en/martyrsList.json";
import searchResults from "./en/searchResults.json";
import shareMemory from "./en/shareMemory.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      about: typeof about;
      common: typeof common;
      contribute: typeof contribute;
      dashboard: typeof dashboard;
      home: typeof home;
      martyrPage: typeof martyrPage;
      martyrsList: typeof martyrsList;
      searchResults: typeof searchResults;
      shareMemory: typeof shareMemory;
    };
  }
}