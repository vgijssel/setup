# Time the performance of ZSH
timezsh() {
  shell=${1-$SHELL}
  for i in $(seq 1 10); do /usr/bin/time $shell -i -c exit; done
}

# Profile ZSH and print out results
profzsh() {
  shell=${1-$SHELL}
  ZPROF=true $shell -i -c exit
}
