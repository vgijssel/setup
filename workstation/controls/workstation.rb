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