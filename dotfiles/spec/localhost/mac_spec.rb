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
# - check latest version for solargraph core

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

# Create launhctl job:
# https://pnguyen.io/posts/launchd-service-management/
# sudo launchctl limit maxfiles 65536 65536
# check sysctl kern.maxfiles
# check sysctl kern.maxfilesperproc
# check ulimit -a
# check ulimit -n (file descriptors)
# check ulimit -u (processes open)
describe command("launchctl limit maxfiles") do
  its(:stdout) { should match(/maxfiles\s+256\s+unlimited/) }
end

def with_clean_env
  "env -i HOME='#{ENV.fetch('HOME')}'"
end

describe command("#{with_clean_env} /bin/bash -c -i env") do
  its(:stdout) { should match /PERSONAL_ENV_LOADED=true/ }
  its(:stderr) { should match 'no job control in this shell' }
end

describe command("#{with_clean_env} /bin/bash -l -c env") do
  its(:stdout) { should match /PERSONAL_ENV_LOADED=true/ }
  its(:stderr) { should be_empty }
end

describe command("#{with_clean_env} /bin/sh -c -i env") do
  it 'does NOT load the env when starting sh interactive' do
    expect(subject.stdout).to_not match /PERSONAL_ENV_LOADED=true/
  end
  its(:stderr) { should match 'no job control in this shell' }
end

describe command("#{with_clean_env} /bin/sh -l -c env") do
  its(:stdout) { should match /PERSONAL_ENV_LOADED=true/ }
  its(:stderr) { should be_empty }
end

describe command("#{with_clean_env} /usr/local/bin/zsh -c env") do
  its(:stdout) { should match /PERSONAL_ENV_LOADED=true/ }
  its(:stderr) { should be_empty }
end

describe command("#{with_clean_env} /usr/local/bin/zsh -l -c env") do
  its(:stdout) { should match /PERSONAL_ENV_LOADED=true/ }
  its(:stderr) { should be_empty }
end
