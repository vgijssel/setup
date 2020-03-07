# frozen_string_literal: true

describe 'Provision' do
  it 'writes the given disk_url to disk' do
    disk_url = "http://#{ENV.fetch('IP_ADDRESS')}:8000/images/kubernetes/kubernetes_buster.qcow2"
    target_disk = '/dev/vda'

    task = run 'hivemind Procfile.tests',
               timeout: 60,
               extra_env: { DISK_URL: disk_url, TARGET_DISK: target_disk }

    result = task.wait

    expect(result.success?).to eq true
    expect(result.stdout).to include("Start remote disk deploy")
    expect(result.stdout).to include("Starting to download disk from '#{disk_url}'")
    expect(result.stdout).to include("Writing 'disk.raw' to disk '#{target_disk}'")
    expect(result.stdout).to include("Done writing disk!")
  end

  # it 'passes all tests on the master before creating a cluster' do
  #   result = ssh_master('validate_preflight', timeout: 60).wait

  #   expect(result.exitstatus).to eq 0
  #   expect(result.error).to be_nil
  # end

  # it 'passes all tests on the worker before creating a cluster' do
  #   result = ssh_worker('validate_preflight', timeout: 60).wait

  #   expect(result.exitstatus).to eq 0
  #   expect(result.error).to be_nil
  # end

  # it 'successfully starts a kubernetes cluster with the master and worker' do
  #   result = run("ansible-playbook -i hosts_test.ini setup_cluster.yml", timeout: 300).wait

  #   expect(result.exitstatus).to eq 0
  #   expect(result.error).to be_nil
  # end

  # it 'passes all tests on the master after creating a cluster' do
  #   result = ssh_master('validate_master', timeout: 60).wait

  #   expect(result.exitstatus).to eq 0
  #   expect(result.error).to be_nil
  # end

  # it 'passes all tests on the worker after creating a cluster' do
  #   result = ssh_worker('validate_worker', timeout: 60).wait

  #   expect(result.exitstatus).to eq 0
  #   expect(result.error).to be_nil
  # end
end
