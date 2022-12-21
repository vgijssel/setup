import { m as o } from "./c.f6611997.js";
import { a as t } from "./c.4266acdb.js";
const n = async (n, s) =>
  t(n, {
    title: "Home Assistant Community Store",
    confirmText: s.localize("common.close"),
    text: o.html(
      `\n  **${s.localize("dialog_about.integration_version")}:** | ${
        s.info.version
      }\n  --|--\n  **${s.localize(
        "dialog_about.frontend_version"
      )}:** | 20220906112053\n  **${s.localize("common.repositories")}:** | ${
        s.repositories.length
      }\n  **${s.localize("dialog_about.downloaded_repositories")}:** | ${
        s.repositories.filter((o) => o.installed).length
      }\n\n  **${s.localize(
        "dialog_about.useful_links"
      )}:**\n\n  - [General documentation](https://hacs.xyz/)\n  - [Configuration](https://hacs.xyz/docs/configuration/start)\n  - [FAQ](https://hacs.xyz/docs/faq/what)\n  - [GitHub](https://github.com/hacs)\n  - [Discord](https://discord.gg/apgchf8)\n  - [Become a GitHub sponsor? ❤️](https://github.com/sponsors/ludeeus)\n  - [BuyMe~~Coffee~~Beer? 🍺🙈](https://buymeacoffee.com/ludeeus)\n\n  ***\n\n  _Everything you find in HACS is **not** tested by Home Assistant, that includes HACS itself.\n  The HACS and Home Assistant teams do not support **anything** you find here._`
    ),
  });
export { n as s };
