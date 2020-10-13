source $(brew --prefix asdf)/asdf.sh

# Make sure brew is in front of asdf, otherwise the Tilt gem will have precendence
# over the Tilt homebrew package.
export PATH="/usr/local/bin/:${PATH}"
