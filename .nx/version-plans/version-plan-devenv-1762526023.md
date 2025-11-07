---
devenv: minor
---

Refactor terminal environment variables into shared dot_terminal_env.sh.tmpl file

- Create new `dot_terminal_env.sh.tmpl` to centralize shared environment variables
- Source shared environment file from both `dot_bashrc` and `dot_zshrc.tmpl`
- Remove duplicate environment variable declarations from both shell configs
- Remove `ll` alias (already provided by zimrc modules)
