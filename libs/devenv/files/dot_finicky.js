export default {
  defaultBrowser: "Google Chrome",
  handlers: [
    {
      match: "hackerone.okta.com/*",
      browser: {
        name: "Google Chrome",
        profile: "Profile 2",
      },
    },
    {
      match: "https://hackerone.atlassian.net/*",
      browser: {
        name: "Google Chrome",
        profile: "Profile 2",
      },
    },
    {
      match: "*.inverselink.com/*",
      browser: {
        name: "Google Chrome",
        profile: "Profile 2",
      },
    },
    {
      match: "*.awsapps.com/*",
      browser: {
        name: "Google Chrome",
        profile: "Profile 2",
      },
    },
    {
      match: "https://oidc.us-west-2.amazonaws.com/*",
      browser: {
        name: "Google Chrome",
        profile: "Profile 2",
      },
    },
  ],
};
