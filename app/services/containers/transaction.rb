# frozen_string_literal: true

# module Containers
#   class Transaction < Dry::System::Container
#     configure do |config|
#       config.auto_register = 'services/transaction'
#       # config.component_dirs.add 'services/transaction'
#     end
#   end
# end

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

