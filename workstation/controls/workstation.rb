control 'git' do
    impact 1.0
    title 'Git version'
    desc "Git version needs to be at least 2.34 for commit signing with SSH keys to work."

    describe package('git') do
        it { should be_installed }
        its('version') { should cmp >= '2.34' }
    end
end

control 'homebrew' do
    impact 10.0
    title 'Homebrew'
    desc "Homebrew needs to be installed"

    describe command("brew") do
        it { should exist} 
    end
end

control 'ssh' do
    impact 10.0
    title 'SSH'
    desc 'macOS should only be reachable by SSH by localhost'

    # TODO: ideally use sshd_config https://docs.chef.io/inspec/resources/sshd_config/ here
    # but does not work yet https://github.com/inspec/inspec/issues/2054#issuecomment-1241029846
    describe file('/etc/ssh/sshd_config') do
        its('content') { should include('AllowUsers *@127.0.0.1') }
    end
end