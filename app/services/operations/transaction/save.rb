# frozen_string_literal: true

module Operations
  module Transaction
    class Save
      CURRENCY_FROM = "USDT"
      CURRENCY_TO = "tBTC"

      include Dry::Transaction::Operation

      def call(params)
        broadcast_error = params.delete(:broadcast_error)

        full_params = params.merge(default_params)

        begin
          transaction = ::Transaction.create(full_params)
        rescue ActiveRecord::StatementInvalid => error
          return Failure(error)
        end

        broadcast_error ?
          Failure(broadcast_error) :
          Success(transaction)
      end

      private

      def default_params
        {
          from: CURRENCY_FROM,
          to: CURRENCY_TO,
        }
      end
    end
  end
end
