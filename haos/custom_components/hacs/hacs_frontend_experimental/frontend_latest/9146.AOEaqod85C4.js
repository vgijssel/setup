export const id = 9146;
export const ids = [9146];
export const modules = {
  59146: (o, r, a) => {
    a.r(r),
      a.d(r, {
        EditorState: () => l.yy,
        EditorView: () => p.tk,
        autocompletion: () => d.ys,
        crosshairCursor: () => p.S2,
        defaultKeymap: () => e.wQ,
        drawSelection: () => p.Uw,
        haSyntaxHighlighting: () => y,
        haTheme: () => b,
        highlightActiveLine: () => p.ZO,
        highlightSelectionMatches: () => m.sW,
        highlightingFor: () => t.QN,
        history: () => e.m8,
        historyKeymap: () => e.f$,
        keymap: () => p.$f,
        langCompartment: () => s,
        langs: () => g,
        lineNumbers: () => p.Eu,
        readonlyCompartment: () => x,
        rectangularSelection: () => p.Zs,
        searchKeymap: () => m.Lp,
        tabKeyBindings: () => v,
        tags: () => n.pJ,
      });
    var e = a(65300),
      t = a(67289),
      c = a(17429),
      i = a(76697),
      l = a(74075),
      p = a(58626),
      n = a(35905),
      d = a(90561),
      m = a(52456);
    const g = { jinja2: t.il.define(c.b), yaml: t.il.define(i.r) },
      s = new l.F6(),
      x = new l.F6(),
      v = [
        { key: "Tab", run: e.at },
        { key: "Shift-Tab", run: e.xi },
      ],
      b = p.tk.theme({
        "&": {
          color: "var(--primary-text-color)",
          backgroundColor:
            "var(--code-editor-background-color, var(--mdc-text-field-fill-color, whitesmoke))",
          borderRadius:
            "var(--mdc-shape-small, 4px) var(--mdc-shape-small, 4px) 0px 0px",
          caretColor: "var(--secondary-text-color)",
          height: "var(--code-mirror-height, auto)",
          maxHeight: "var(--code-mirror-max-height, unset)",
        },
        "&.cm-editor.cm-focused": { outline: "none" },
        "&.cm-focused .cm-cursor": {
          borderLeftColor: "var(--secondary-text-color)",
        },
        ".cm-selectionBackground, ::selection": {
          backgroundColor: "rgba(var(--rgb-primary-color), 0.1)",
        },
        "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":
          { backgroundColor: "rgba(var(--rgb-primary-color), 0.2)" },
        ".cm-activeLine": {
          backgroundColor: "rgba(var(--rgb-secondary-text-color), 0.1)",
        },
        ".cm-scroller": { outline: "none" },
        ".cm-content": {
          caretColor: "var(--secondary-text-color)",
          paddingTop: "16px",
          paddingBottom: "16px",
        },
        ".cm-panels": {
          backgroundColor: "var(--primary-background-color)",
          color: "var(--primary-text-color)",
        },
        ".cm-panels.top": { borderBottom: "1px solid var(--divider-color)" },
        ".cm-panels.bottom": { borderTop: "1px solid var(--divider-color)" },
        ".cm-button": {
          border: "1px solid var(--primary-color)",
          padding: "0px 16px",
          textTransform: "uppercase",
          margin: "4px",
          background: "none",
          color: "var(--primary-color)",
          fontFamily:
            "var(--mdc-typography-button-font-family, var(--mdc-typography-font-family, Roboto, sans-serif))",
          fontSize: "var(--mdc-typography-button-font-size, 0.875rem)",
          height: "36px",
          fontWeight: "var(--mdc-typography-button-font-weight, 500)",
          borderRadius: "4px",
          letterSpacing:
            "var(--mdc-typography-button-letter-spacing, 0.0892857em)",
        },
        ".cm-textfield": {
          padding: "4px 0px 5px",
          borderRadius: "0",
          fontSize: "16px",
          color: "var(--primary-text-color)",
          border: "0",
          background: "none",
          fontFamily: "Roboto",
          borderBottom: "1px solid var(--secondary-text-color)",
          margin: "4px 4px 0",
          "& ::placeholder": { color: "var(--secondary-text-color)" },
          "&:focus": {
            outline: "none",
            borderBottom: "2px solid var(--primary-color)",
            paddingBottom: "4px",
          },
        },
        ".cm-tooltip": {
          color: "var(--primary-text-color)",
          backgroundColor:
            "var(--code-editor-background-color, var(--card-background-color))",
          border: "1px solid var(--divider-color)",
          borderRadius: "var(--mdc-shape-medium, 4px)",
          boxShadow:
            "0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)",
        },
        "& .cm-tooltip.cm-tooltip-autocomplete > ul > li": {
          padding: "4px 8px",
        },
        "& .cm-tooltip-autocomplete ul li[aria-selected]": {
          background: "var(--primary-color)",
          color: "var(--text-primary-color)",
        },
        ".cm-completionIcon": { display: "none" },
        ".cm-completionDetail": {
          fontFamily: "Roboto",
          color: "var(--secondary-text-color)",
        },
        "li[aria-selected] .cm-completionDetail": {
          color: "var(--text-primary-color)",
        },
        "& .cm-completionInfo.cm-completionInfo-right": {
          left: "calc(100% + 4px)",
        },
        "& .cm-tooltip.cm-completionInfo": {
          padding: "4px 8px",
          marginTop: "-5px",
        },
        ".cm-selectionMatch": {
          backgroundColor: "rgba(var(--rgb-primary-color), 0.1)",
        },
        ".cm-searchMatch": {
          backgroundColor: "rgba(var(--rgb-accent-color), .2)",
          outline: "1px solid rgba(var(--rgb-accent-color), .4)",
        },
        ".cm-searchMatch.selected": {
          backgroundColor: "rgba(var(--rgb-accent-color), .4)",
          outline: "1px solid var(--accent-color)",
        },
        ".cm-gutters": {
          backgroundColor:
            "var(--code-editor-gutter-color, var(--secondary-background-color, whitesmoke))",
          color: "var(--paper-dialog-color, var(--secondary-text-color))",
          border: "none",
          borderRight: "1px solid var(--secondary-text-color)",
          paddingRight: "1px",
        },
        "&.cm-focused .cm-gutters": {
          borderRight: "2px solid var(--primary-color)",
          paddingRight: "0",
        },
        ".cm-gutterElement.lineNumber": { color: "inherit" },
      }),
      u = t.Qf.define([
        { tag: n.pJ.keyword, color: "var(--codemirror-keyword, #6262FF)" },
        {
          tag: [
            n.pJ.name,
            n.pJ.deleted,
            n.pJ.character,
            n.pJ.propertyName,
            n.pJ.macroName,
          ],
          color: "var(--codemirror-property, #905)",
        },
        {
          tag: [n.pJ.function(n.pJ.variableName), n.pJ.labelName],
          color: "var(--codemirror-variable, #07a)",
        },
        {
          tag: [n.pJ.color, n.pJ.constant(n.pJ.name), n.pJ.standard(n.pJ.name)],
          color: "var(--codemirror-qualifier, #690)",
        },
        {
          tag: [n.pJ.definition(n.pJ.name), n.pJ.separator],
          color: "var(--codemirror-def, #8DA6CE)",
        },
        {
          tag: [
            n.pJ.typeName,
            n.pJ.className,
            n.pJ.number,
            n.pJ.changed,
            n.pJ.annotation,
            n.pJ.modifier,
            n.pJ.self,
            n.pJ.namespace,
          ],
          color: "var(--codemirror-number, #ca7841)",
        },
        {
          tag: [
            n.pJ.operator,
            n.pJ.operatorKeyword,
            n.pJ.url,
            n.pJ.escape,
            n.pJ.regexp,
            n.pJ.link,
            n.pJ.special(n.pJ.string),
          ],
          color: "var(--codemirror-operator, #cda869)",
        },
        { tag: n.pJ.comment, color: "var(--codemirror-comment, #777)" },
        {
          tag: n.pJ.meta,
          color: "var(--codemirror-meta, var(--primary-text-color))",
        },
        { tag: n.pJ.strong, fontWeight: "bold" },
        { tag: n.pJ.emphasis, fontStyle: "italic" },
        {
          tag: n.pJ.link,
          color: "var(--primary-color)",
          textDecoration: "underline",
        },
        { tag: n.pJ.heading, fontWeight: "bold" },
        { tag: n.pJ.atom, color: "var(--codemirror-atom, #F90)" },
        { tag: n.pJ.bool, color: "var(--codemirror-atom, #F90)" },
        {
          tag: n.pJ.special(n.pJ.variableName),
          color: "var(--codemirror-variable-2, #690)",
        },
        {
          tag: n.pJ.processingInstruction,
          color: "var(--secondary-text-color)",
        },
        { tag: n.pJ.string, color: "var(--codemirror-string, #07a)" },
        { tag: n.pJ.inserted, color: "var(--codemirror-string2, #07a)" },
        { tag: n.pJ.invalid, color: "var(--error-color)" },
      ]),
      y = (0, t.nF)(u);
  },
};
//# sourceMappingURL=9146.AOEaqod85C4.js.map
