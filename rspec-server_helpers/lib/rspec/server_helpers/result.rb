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
  end
end
