# frozen_string_literal: true

module Operations
  module Transaction
    class Save
      include Dry::Transaction::Operation

      def call(input)
        Rails.logger.debug("save")
        Success(input)
      end
    end
  end
end
