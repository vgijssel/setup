# frozen_string_literal: true

require 'rspec/server_helpers/version'

require 'async'
require 'async/process'
require 'bundler'

module RSpec
  module ServerHelpers
    class Result
      attr_reader :exitstatus
      attr_reader :error

      def initialize(exitstatus, error = nil)
        @exitstatus = exitstatus
        @error = error
      end

      def success?
        !exitstatus.nil? && exitstatus.zero?
      end
    end

    def self.reactor
      @reactor ||= Async::Reactor.new
    end

    module Helpers
      def run(command, timeout:)
        Async do |process_wrapper_task|
          begin
            process_wrapper_task.with_timeout(timeout) do
              # Get the environment before applying bundler
              # note we can also do Bundler.clean_env to remove bundler variables from the env
              environment = Bundler.original_env

              puts "Starting process: #{command}"

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
            Result.new(nil, e)
          rescue Async::Wrapper::Cancelled => e
            Result.new(nil, e)
          end
        end
      end

      def wait_for_ssh(host, timeout:)
        Async do |wait_task|
          wait_task.with_timeout(timeout) do
            loop do
              result = ssh('true', host, timeout: 2).wait

              if result.success?
                break
              else
                puts 'SSH failed, retrying in 1s...'
                wait_task.sleep(1)
              end
            end
          end
        end.wait
      end

      def ssh(command, host, timeout:)
        id_rsa_path = "#{ENV.fetch('SETUP_SCRIPTS_DIR')}/keys/id_rsa"
        ssh_command = "ssh debian@#{host} -i #{id_rsa_path} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null #{command}"

        run(ssh_command, timeout: timeout)
      end
    end
  end
end

# To make sure processes started with Async::Process within the reactor are stopped!
# For some reason the reactor.stop method needs to be called twice, which will happen
# when force quitting RSpec.
Signal.trap('INT') do
  RSpec::ServerHelpers.reactor.stop
  RSpec::Core::Runner.handle_interrupt
end

RSpec.configure do |config|
  config.include RSpec::ServerHelpers::Helpers

  config.around(:each) do |example|
    RSpec::ServerHelpers.reactor.async do
      aggregate_failures do
        example.run
      end
    end
    RSpec::ServerHelpers.reactor.run
    RSpec::ServerHelpers.reactor.stop
  end
end
