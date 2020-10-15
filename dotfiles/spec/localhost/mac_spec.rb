require 'spec_helper'

# Some examples: https://github.com/tubone24/mac-auto-setup/blob/9aab31064e1318d9908977caee337ac812701446/serverspec/mac/spec/localhost/spec_mac.rb

describe package('git') do
  it { should be_installed }
end
