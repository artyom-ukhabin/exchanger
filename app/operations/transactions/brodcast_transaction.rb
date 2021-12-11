# frozen_string_literal: true

module Transactions
  class BroadcastTransaction
    include Dry::Transaction::Operation

    def call(input)
      Rails.logger.debug("broadcast_transaction")
      Success(input)
    end
  end
end
