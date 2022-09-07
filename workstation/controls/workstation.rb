control 'git' do
    impact 1.0
    title 'Git version'
    desc "Gti version needs to be at least 2.34 for commit signing with SSH keys to work."

    describe package('git') do
        it { should be_installed }
        its('version') { should cmp >= '2.34' }
    end

    describe os.family do
        it { should eq 'darwin' }
    end

    describe command("brew") do
        it { should exist} 
    end
end