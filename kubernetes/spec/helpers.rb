# frozen_string_literal: true

require 'async'
require 'async/process'
require 'bundler'

class Result
  attr_reader :exitstatus
  attr_reader :error

  def initialize(exitstatus, error = nil)
    @exitstatus = exitstatus
    @error = error
  end

  def success?
    exitstatus.zero?
  end
end

def run(command, timeout:)
  Async do |process_wrapper_task|
    begin
      process_wrapper_task.with_timeout(timeout) do
        # Get the environment before applying bundler
        # note we can also do Bundler.clean_env to remove bundler variables from the env
        environment = Bundler.original_env

        result = Async::Process.spawn(
          environment,
          command,
          out: STDOUT,
          err: %i[child out],
          unsetenv_others: true
        )

        Result.new(result.exitstatus)
      end
    rescue Async::TimeoutError => e
      Result.new(status.exitstatus, e)
    rescue Async::Wrapper::Cancelled => e
      Result.new(status.exitstatus, e)
    end
  end
end

def ssh_master(command, timeout:)
  ssh command, '192.168.64.101', timeout: timeout
end

def ssh_worker(command, timeout:)
  ssh command, '192.168.64.102', timeout: timeout
end

def ssh(command, host, timeout:)
  id_rsa_path = "#{ENV.fetch('SETUP_SCRIPTS_DIR')}/keys/id_rsa"
  ssh_command = "ssh debian@#{host} -i #{id_rsa_path} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null #{command}"

  run(ssh_command, timeout: timeout)
end
