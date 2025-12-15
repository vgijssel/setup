export default {
  defaultBrowser: "Google Chrome",
  handlers: [
    {
      match: "hackerone.okta.com/*",
      browser: {
        name: "Google Chrome",
        profile: "HackerOne.com",
      },
    },
    {
      match: "https://hackerone.atlassian.net/*",
      browser: {
        name: "Google Chrome",
        profile: "HackerOne.com",
      },
    },
    {
      match: "*.inverselink.com/*",
      browser: {
        name: "Google Chrome",
        profile: "HackerOne.com",
      },
    },
    {
      match: "*.awsapps.com/*",
      browser: {
        name: "Google Chrome",
        profile: "HackerOne.com",
      },
    },
    {
      match: "https://oidc.us-west-2.amazonaws.com/*",
      browser: {
        name: "Google Chrome",
        profile: "HackerOne.com",
      },
    },
    {
      match: "https://claude.ai/*",
      browser: {
        name: "Google Chrome",
        profile: "vgijssel.nl",
      },
    },
  ],
};
