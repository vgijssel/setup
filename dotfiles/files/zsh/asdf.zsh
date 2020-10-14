if [ -e "$HOME/.asdf/asdf.sh" ]; then
  source $HOME/.asdf/asdf.sh
fi

# Make sure brew is in front of asdf, otherwise the Tilt gem will have precendence
# over the Tilt homebrew package.
export PATH="/usr/local/bin/:${PATH}"
