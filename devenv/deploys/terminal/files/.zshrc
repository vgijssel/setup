# start profiling in ZSH
if [[ "$ZPROF" = true ]]; then
  zmodload zsh/zprof
fi

eval "$(sheldon source)"

alias ll='ls -lah'
alias edit='code'

# stop ZSH profiling and print profiling information
if [[ "$ZPROF" = true ]]; then
  zprof
fi

test -f /Users/maarten/.cache/trunk/shell-hooks/zsh.rc && source /Users/maarten/.cache/trunk/shell-hooks/zsh.rc;
