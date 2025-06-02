export default {
  defaultBrowser: "Google Chrome",
  handlers: [
    {
      match: "hackerone.okta.com",
      browser: {
        name: "Google Chrome",
        profile: "Profile 2"
      }
    },
    {
      match: "*.inverselink.com/*",
      browser: {
        name: "Google Chrome",
        profile: "Profile 2"
      }
    }
  ]
}
