# frozen_string_literal: true

module Transactions
  class Save
    include Dry::Transaction::Operation

    def call(input)
      Rails.logger.debug("save")
      Success(input)
    end
  end
end
