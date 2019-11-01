# TODO: use vim keybingins in terminal?
# TODO: fzf history only works after pressing ENTER in other terminal
# TODO: brew zsh autocompletion

# Check if zplug is installed
if [[ ! -d ~/.zplug ]]; then
    git clone https://github.com/zplug/zplug ~/.zplug
    source ~/.zplug/init.zsh && zplug update --self
fi

# Essential
source ~/.zplug/init.zsh

zplug "mafredri/zsh-async", from:github
zplug "sindresorhus/pure", use:"pure.zsh", from:github, as:theme
zplug "nicodebo/base16-fzf", use:"bash/base16-snazzy.config", defer:3, as:theme

zplug "zsh-users/zsh-completions",              defer:0
zplug "zsh-users/zsh-autosuggestions",          defer:2, on:"zsh-users/zsh-completions"
zplug "zsh-users/zsh-syntax-highlighting",      defer:3, on:"zsh-users/zsh-autosuggestions"

zplug check || zplug install
zplug load

# BEGIN ANSIBLE MANAGED BLOCK: asdf
if [ -e "$HOME/.asdf/asdf.sh" ]; then
  source $HOME/.asdf/asdf.sh
  source $HOME/.asdf/completions/asdf.bash
fi
# END ANSIBLE MANAGED BLOCK: asdf

eval "$(direnv hook zsh)"

### Generated by /usr/local/opt/fzf/install
# Auto-completion
# ---------------
[[ $- == *i* ]] && source "/usr/local/opt/fzf/shell/completion.zsh" 2> /dev/null

# Key bindings
# ------------
source "/usr/local/opt/fzf/shell/key-bindings.zsh"

setopt inc_append_history   # Write immediately to history file
setopt share_history        # Share history among sessions
setopt hist_reduce_blanks   # Trim whitespace
setopt hist_ignore_space    # Ignore entries starting with space

BREW_PREFIX=$(brew --prefix)
GNU_CORE_UTILS="${BREW_PREFIX}/opt/coreutils/libexec/gnubin"
GNU_FIND_UTILS="${BREW_PREFIX}/opt/findutils/libexec/gnubin"
GNU_INDENT="${BREW_PREFIX}/opt/gnu-indent/libexec/gnubin"
GNU_SED="${BREW_PREFIX}/opt/gnu-sed/libexec/gnubin"
GNU_TAR="${BREW_PREFIX}/opt/gnu-tar/libexec/gnubin"
GNU_WHICH="${BREW_PREFIX}/opt/gnu-which/libexec/gnubin"
GNU_GREP="${BREW_PREFIX}/opt/grep/libexec/gnubin"
CUSTOM_TILT="${HOME}/.asdf/installs/golang/1.12/packages/bin"

export PATH=\
"${CUSTOM_TILT}:"\
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
export ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE="fg=10"
export HISTFILE=~/.zsh_history
export HISTFILESIZE=100000
export HISTSIZE=100000

alias ll="ls -lah"
alias dotf="cd ~/.nixpkgs/dotfiles"
alias core="cd ~/Development/hackerone/core"
alias pain="cd ~/Development/hackerone/payments"
alias hack="cd ~/Development/hackerone"
alias dev="cd ~/Development"
alias ddc="docker-compose"
alias emacsclient="emacsclient -s $HOME/.emacs.d/server/server"
alias edit="emacsclient -s $HOME/.emacs.d/server/server"

# (NF) checks if the directory is not empty (entries besides . and ..)
if [ "${HOME}/.zsh"(NF) ]; then
  for file in ~/.zsh/*; do
    source $file
  done
fi

export SSH_AUTH_SOCK=$(gpgconf --list-dirs agent-ssh-socket)
gpgconf --launch gpg-agent
