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

describe systemd_service('ignited') do
  it { should be_installed }
  it { should be_enabled }
  it { should be_running }
end

describe user('packer') do
  it { should_not exist }
end

describe group('packer') do
  it { should_not exist }
end

describe command('kvm-ok') do
  its('stdout') { should match ("INFO: /dev/kvm exists\nKVM acceleration can be used") }
  its('exit_status') { should eq 0 }
end

describe 'firewall' do
  describe systemd_service('ufw') do
    it { should be_installed }
    it { should be_enabled }
    it { should be_running }
  end

  describe port(22) do
    it { should be_listening }
    its('processes') {should include 'sshd'}
  end

  describe port(80) do
    it { should_not be_listening }
  end

  describe command('ufw status') do
    its('stdout') { should match ("Status: active") }
    its('exit_status') { should eq 0 }
  end
end

describe 'automatic updates' do
  describe systemd_service('unattended-upgrades') do
    it { should be_installed }
    it { should be_enabled }
    it { should be_running }
  end

  describe command('apt-config dump APT::Periodic::Unattended-Upgrade') do
    it 'installs automatic updates every 1 day' do
      expect(subject.stdout.strip).to eq 'APT::Periodic::Unattended-Upgrade "1";'
    end

    its('exit_status') { should eq 0 }
  end
end

# port 22 open
# port 80 closed