describe 'Kubernetes cluster setup' do
  it 'passes all tests on the master before creating a cluster' do
    result = ssh_master('validate_preflight', timeout: 60).wait

    expect(result.exitstatus).to eq 0
    expect(result.error).to be_nil
  end

  it 'passes all tests on the worker before creating a cluster' do
    result = ssh_worker('validate_preflight', timeout: 60).wait

    expect(result.exitstatus).to eq 0
    expect(result.error).to be_nil
  end

  it 'successfully starts a kubernetes cluster with the master and worker' do
    result = run("ansible-playbook -i hosts_test.ini setup_cluster.yml", timeout: 300).wait

    expect(result.exitstatus).to eq 0
    expect(result.error).to be_nil
  end

  it 'passes all tests on the master after creating a cluster' do
    result = ssh_master('validate_master', timeout: 60).wait

    expect(result.exitstatus).to eq 0
    expect(result.error).to be_nil
  end

  it 'passes all tests on the worker after creating a cluster' do
    result = ssh_worker('validate_worker', timeout: 60).wait

    expect(result.exitstatus).to eq 0
    expect(result.error).to be_nil
  end
end
