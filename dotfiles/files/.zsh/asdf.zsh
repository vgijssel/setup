if [ -e "$HOME/.asdf/asdf.sh" ]; then
  source $HOME/.asdf/asdf.sh
  source $HOME/.asdf/completions/asdf.bash
fi

# NOTE: make sure brew is in front of asdf
export PATH="/usr/local/bin/:${PATH}"
