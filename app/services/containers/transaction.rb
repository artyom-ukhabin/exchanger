# frozen_string_literal: true

module Containers
  class Transaction
    extend Dry::Container::Mixin

    register "validate" do
      Operations::Transaction::Validate.new
    end

    register "broadcast_transaction" do
      Operations::Transaction::BroadcastTransaction.new
    end

    register "save" do
      Operations::Transaction::Save.new
    end
  end
end
