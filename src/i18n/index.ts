import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const supportedLanguages = ["en", "ar"] as const;
export const namespaces = ["common", "home", "dashboard"] as const;

const namespaceLoaders = import.meta.glob("./*/*.json");

const backend = {
  type: "backend" as const,
  init: () => {},
  read(language: string, namespace: string, callback: (error: Error | null, data?: unknown) => void) {
    const loader = namespaceLoaders[`./${language}/${namespace}.json`];

    if (!loader) {
      callback(new Error(`Missing translation namespace: ${language}/${namespace}`));
      return;
    }

    loader()
      .then((module: any) => callback(null, module.default))
      .catch((error) => callback(error));
  },
};

void i18n
  .use(backend)
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    supportedLngs: supportedLanguages,
    ns: namespaces as unknown as string[],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    returnNull: false,
    partialBundledLanguages: true,
    initImmediate: false,
  });

export default i18n;