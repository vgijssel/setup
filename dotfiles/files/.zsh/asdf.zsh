if [ -e "$HOME/.asdf/asdf.sh" ]; then
  source $HOME/.asdf/asdf.sh
  source $HOME/.asdf/completions/asdf.bash
fi

CUSTOM_TILT="${HOME}/.asdf/installs/golang/1.12/packages/bin"
export PATH="${CUSTOM_TILT}:${PATH}"
