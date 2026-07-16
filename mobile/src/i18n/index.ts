import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import id from "./language/id.json";
import ja from "./language/ja.json";

//empty for now
const resources = {
  id: {
    translation: id,
  },
  ja: {
    translation: ja,
  },
};

export const changeLanguage = (translation: string) => {
  //i18n.language = translation;
  i18n.changeLanguage(translation);
};

i18n.use(initReactI18next).init({
  resources,
  lng: "id",
  compatibilityJSON: "v3",
  //language to use if translations in user language are not available
  fallbackLng: ["id", "ja"],
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

export default i18n;
