const s = async (s, o) =>
    s.connection.sendMessagePromise({
      type: "hacs/repository/info",
      repository_id: o,
    }),
  o = async (s, o, e) =>
    s.connection.sendMessagePromise({
      type: "hacs/repository/download",
      repository: o,
      version: e,
    }),
  e = async (s, o, e) =>
    s.connection.sendMessagePromise({
      type: "hacs/repository/version",
      repository: o,
      version: e,
    });
export { o as a, s as f, e as r };
