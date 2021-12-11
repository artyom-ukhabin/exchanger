# frozen_string_literal: true

module Operations
  module Transaction
    class BroadcastTransaction
      include Dry::Transaction::Operation

      def call(input)
        Rails.logger.debug("broadcast_transaction")
        Success(input)
      end
    end
  end
end
