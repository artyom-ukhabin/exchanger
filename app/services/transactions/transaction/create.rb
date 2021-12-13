# frozen_string_literal: true

module Transactions
  module Transaction
    class Create
      include Dry::Transaction(container: Containers::Transaction)

      step :validate, with: "validate"
      step :broadcast_transaction, with: "broadcast_transaction"
      step :save, with: "save"
    end
  end
end
