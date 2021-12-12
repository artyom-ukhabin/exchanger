# frozen_string_literal: true

module Operations
  module Transaction
    class Validate
      include Dry::Transaction::Operation

      def call(params)
        result = contract.call(params)
        result.errors.any? ? Failure(errors: result.errors) : Success(params)
      end

      private

      def contract
        Contracts::Transaction.new
      end
    end
  end
end
