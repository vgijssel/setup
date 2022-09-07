control 'git' do
    impact 1.0
    title 'Git version'
    desc "Gti version needs to be at least 2.34 for commit signing with SSH keys to work."

    # describe package('git') do
    #     it { should be_installed }
    #     # its('version') { should cmp >= '2.34' }
    # end

    describe file('/tmp/kerk') do                       # The actual test
        its('content') { should match 'shine' }      # You could just do the "describe file" block if you want. The  
    end 
end