require 'spec_helper'

# Some examples: https://github.com/tubone24/mac-auto-setup/blob/9aab31064e1318d9908977caee337ac812701446/serverspec/mac/spec/localhost/spec_mac.rb

## TODO: Tests
# - check if git works with gpg
# - npm global packages
# - language versions
# - check how dns is resolved! Through dns-heaven? What about the .test domain?
# - check file limit
# - check if services are NOT running on 0.0.0.0

describe package('git') do
  it { should be_installed }
end

describe host('development.server.test') do
  it { should be_resolvable }
end
