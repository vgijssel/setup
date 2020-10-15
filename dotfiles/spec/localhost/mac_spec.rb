require 'spec_helper'

# Some examples: https://github.com/tubone24/mac-auto-setup/blob/9aab31064e1318d9908977caee337ac812701446/serverspec/mac/spec/localhost/spec_mac.rb

## TODO: Tests
# - check if git works with gpg
# - npm global packages
# - language versions
# - check how dns is resolved! Through dns-heaven? What about the .test domain?
# - check file limit
# - check if services are NOT running on 0.0.0.0
# - check if packer forwarding is enabled sysctl -w net.inet.ip.forwarding=1
# - check memory usage for docker for mac

describe package('git') do
  it { should be_installed }
end

describe host('google.com') do
  it 'can resolve dns from the internet' do
    should be_resolvable
  end
end

# describe host('development.server.test') do
#   it 'can resolve local development dns' do
#     should be_resolvable
#   end
# end

describe file('/etc/resolv.conf') do
  its(:content) { should match /nameserver 127.0.0.1/ }
end

# describe file('/etc/resolver/test') do
#   its(:content) { should match /nameserver 127.0.0.1/ }
# end

describe process("dns-heaven") do
  it { should be_running }
end
