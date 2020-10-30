require 'serverspec'
require 'pry'

RSpec.configure do |config|
  # Use color in STDOUT
  config.color = true

  # Use color not only in STDOUT but also in pagers and files
  config.tty = true
end

set :backend, :exec

