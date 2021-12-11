# frozen_string_literal: true

module Transactions
  class Validate
    include Dry::Transaction::Operation

    def call(input)
      Rails.logger.debug("validate")
      Success(input)
    end
  end
end
