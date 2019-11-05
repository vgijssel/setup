# start profiling in ZSH
if [[ "$ZPROF" = true ]]; then
  zmodload zsh/zprof
fi

setopt extended_history       # record timestamp of command in HISTFILE
setopt hist_expire_dups_first # delete duplicates first when HISTFILE size exceeds HISTSIZE
setopt hist_ignore_dups       # ignore duplicated commands history list
setopt hist_ignore_space      # ignore commands that start with space
setopt hist_verify            # show command with history expansion to user before running it
setopt inc_append_history     # add commands to HISTFILE in order of execution
setopt share_history          # share command history data

BREW_PREFIX=$(brew --prefix)
GNU_CORE_UTILS="${BREW_PREFIX}/opt/coreutils/libexec/gnubin"
GNU_FIND_UTILS="${BREW_PREFIX}/opt/findutils/libexec/gnubin"
GNU_INDENT="${BREW_PREFIX}/opt/gnu-indent/libexec/gnubin"
GNU_SED="${BREW_PREFIX}/opt/gnu-sed/libexec/gnubin"
GNU_TAR="${BREW_PREFIX}/opt/gnu-tar/libexec/gnubin"
GNU_WHICH="${BREW_PREFIX}/opt/gnu-which/libexec/gnubin"
GNU_GREP="${BREW_PREFIX}/opt/grep/libexec/gnubin"

# TODO: prettier way to not hardcode the asdf path here?
# currently necessary for spacemacs to have the paths in front on /usr/bin
# so spacemacs does not call the system ruby but asdf ruby
export PATH=\
"${HOME}/.asdf/shims:${HOME}/.asdf/bin:"\
"/usr/local/bin/:"\
"${HOME}/bin:"\
"/Applications/Postgres.app/Contents/Versions/latest/bin:"\
"${GNU_CORE_UTILS}:"\
"${GNU_CORE_UTILS}:"\
"${GNU_FIND_UTILS}:"\
"${GNU_INDENT}:"\
"${GNU_SED}:"\
"${GNU_TAR}:"\
"${GNU_WHICH}:"\
"${GNU_GREP}:"\
"${PATH}"
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export EDITOR="emacsclient -s $HOME/.emacs.d/server/server"
export VISUAL="emacsclient -s $HOME/.emacs.d/server/server"
export DOCKER_BUILDKIT=1
export HISTFILE=~/.zsh_history
export HISTFILESIZE=100000
export HISTSIZE=100000

alias ll="ls -lah"
alias emacsclient="emacsclient -s $HOME/.emacs.d/server/server"
alias edit="emacsclient -s $HOME/.emacs.d/server/server"

if [[ ! -d ~/.zplugin ]]; then
    mkdir ~/.zplugin
    git clone https://github.com/zdharma/zplugin.git ~/.zplugin/bin
fi

source ~/.zplugin/bin/zplugin.zsh

# https://github.com/zdharma/zplugin#plugin-output
# controls how verbose the loading messages are
zplugin_plugin_output=lucid

# https://github.com/zdharma/zplugin#loading-and-unloading
# controls how many features loading a plugin has: load,light
# $zplugin_load is faster, load allows for reporting
zplugin_load=light

zplugin ice $zplugin_plugin_output pick"async.zsh" src"pure.zsh"
zplugin $zplugin_load sindresorhus/pure

zplugin ice $zplugin_plugin_output pick"bash/base16-snazzy.config"
zplugin $zplugin_load "nicodebo/base16-fzf"

# z: for quickly jumping to recently used directories
# NOTE: blockf blocks the loading of auto completion in favour of fz
zplugin ice $zplugin_plugin_output wait blockf
zplugin $zplugin_load rupa/z

# z fuzzy tab completion
zplugin ice $zplugin_plugin_output wait
zplugin $zplugin_load changyuheng/fz

# TODO: is little bit broken with tail
# z / fzf (ctrl-g)
# zplugin ice wait lucid
# zplugin $zplugin_load andrewferrier/fzf-z

zplugin ice $zplugin_plugin_output wait multisrc'asdf.zsh fzf.zsh gpg.zsh direnv.zsh'
zplugin $zplugin_load ~/.zsh

zplugin ice $zplugin_plugin_output wait blockf atpull'zplugin creinstall -q .'
zplugin $zplugin_load zsh-users/zsh-completions

# TODO: colors do not work in Ruby terminal, does another plugin work?
zplugin ice $zplugin_plugin_output wait atinit"zpcompinit; zpcdreplay"
zplugin $zplugin_load zdharma/fast-syntax-highlighting

zplugin ice $zplugin_plugin_output wait atload"_zsh_autosuggest_start"
zplugin $zplugin_load zsh-users/zsh-autosuggestions

# stop ZSH profiling and print profiling information
if [[ "$ZPROF" = true ]]; then
  zprof
fi
