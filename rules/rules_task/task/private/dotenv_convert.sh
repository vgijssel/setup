#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

input_file=$1
output_file=$2

sed 's/\([^ ]*\) \(.*\)/\1=\2/' $input_file > $output_file
