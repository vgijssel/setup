const s = (s) =>
    `https://brands.home-assistant.io/${s.brand ? "brands/" : ""}${
      s.useFallback ? "_/" : ""
    }${s.domain}/${s.darkOptimized ? "dark_" : ""}${s.type}.png`,
  a = (s) => s.split("/")[4],
  t = (s) => s.startsWith("https://brands.home-assistant.io/");
export { s as b, a as e, t as i };
