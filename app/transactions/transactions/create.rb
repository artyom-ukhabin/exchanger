# frozen_string_literal: true

module Transactions
  class Create
    include Dry::Transaction(container: Container)

    step :validate, with: 'transactions.validate'
    step :broadcast_transaction, with: 'transactions.broadcast_transaction'
    step :save, with: 'transactions.save'
  end
end
