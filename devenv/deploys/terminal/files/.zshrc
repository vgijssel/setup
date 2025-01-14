alias ll='ls -lah'
alias edit='code'

test -f $HOME/.cache/trunk/shell-hooks/zsh.rc && source $HOME/.cache/trunk/shell-hooks/zsh.rc;

eval "$(zoxide init zsh)"
eval "$(direnv hook zsh)"