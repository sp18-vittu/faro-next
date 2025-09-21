module.exports = {
  i18n: {
    defaultLocale: "ja",
    locales: ["en", "es", "ja", "hi", "pt"]
  },
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/locales",
};
