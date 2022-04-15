describe package("git") do
  it { should be_installed }
end

describe command('ignite version') do
  its('stdout') { should match (/Ignite version:/) }
  its('exit_status') { should eq 0 }
end

describe kernel_parameter('net.ipv4.ip_forward') do
  its('value') { should eq 1 }
end

describe kernel_module('loop') do
  it { should_not be_disabled }
  it { should_not be_blacklisted }
end

describe package("docker-ce") do
  it { should be_installed }
end

describe "docker.info" do
  subject { docker.info }

  it 'server version is higher than 20.10.13' do
    expect(Semverse::Version.new(subject.ServerVersion)).to be > Semverse::Version.new('20.10.13')
  end
end

describe package("containerd.io") do
  it { should be_installed }
end

describe command('/opt/cni/bin/bridge') do
  its('stderr.strip') { should eq 'CNI bridge plugin v0.9.1' }
  its('exit_status') { should eq 0 }
end