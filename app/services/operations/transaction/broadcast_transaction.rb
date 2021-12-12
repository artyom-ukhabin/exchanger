# frozen_string_literal: true

module Operations
  module Transaction
    class BroadcastTransaction
      include Dry::Transaction::Operation

      def initialize
        @bitcoin_wallet = BitcoinWallet.new
      end

      def call(params)
        # result = @bitcoin_wallet.pay(
        #   params[:destination],
        #   params[:exchanged_sum],
        #   params[:exchanged_fee],
        # )

        # result[:success] ?
        #   Success(params.merge(txid: result[:idx])) :
        #   Failure(general: result[:message])

        Rails.logger.debug("broadcast_transaction")
        Success(params)
      end
    end
  end
end
