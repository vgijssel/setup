# frozen_string_literal: true

describe 'Provision' do
  it 'writes the given disk_url to disk' do
    disk_url = "http://#{ENV.fetch('IP_ADDRESS')}:8000/images/kubernetes/kubernetes_buster.qcow2"
    target_disk = '/dev/vda'

    task = run 'hivemind Procfile.tests',
               timeout: 120,
               extra_env: { DISK_URL: disk_url, TARGET_DISK: target_disk }

    result = task.wait

    expect(result.success?).to eq true
    expect(result.stdout).to include("Start remote disk deploy")
    expect(result.stdout).to include("Starting to download disk from '#{disk_url}'")
    expect(result.stdout).to include("Writing 'disk.raw' to disk '#{target_disk}'")
    expect(result.stdout).to include("Done writing disk!")
  end

  it 'is able to boot the provisioned disk' do
    server_task = run 'hivemind Procfile.provisioned', timeout: 300
    wait_for_ssh '192.168.64.101', timeout: 60

    result = ssh('validate_preflight', '192.168.64.101', timeout: 60).wait
    server_task.stop

    expect(result.exitstatus).to eq 0
    expect(result.error).to be_nil
  end
end
