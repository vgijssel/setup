const e = () => {
    const e = {},
      r = new URLSearchParams(location.search);
    for (const [n, t] of r.entries()) e[n] = t;
    return e;
  },
  r = (e) => {
    const r = new URLSearchParams();
    return (
      Object.entries(e).forEach(([e, n]) => {
        r.append(e, n);
      }),
      r.toString()
    );
  };
export { r as c, e };
