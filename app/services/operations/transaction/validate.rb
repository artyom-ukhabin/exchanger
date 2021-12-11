# frozen_string_literal: true

module Operations
  module Transaction
    class Validate
      include Dry::Transaction::Operation

      def call(input)
        Rails.logger.debug("validate")
        Success(input)
      end
    end
  end
end
