# frozen_string_literal: true

module Operations
  module Transaction
    class BroadcastTransaction
      BTC_PARAMS = %i[exchanged_sum exchange_fee].freeze

      include Dry::Transaction::Operation

      def initialize
        @bitcoin_wallet = BitcoinWallet.new
      end

      def call(params)
        BTC_PARAMS.each do |param|
          params[param] = @bitcoin_wallet.btc_to_satoshi(params[param])
        end

        # result = @bitcoin_wallet.pay(
        #   params[:destination],
        #   params[:exchanged_sum],
        #   params[:exchange_fee],
        # )

        params.merge!(network_fee: BitcoinWallet::NETWORK_FEE)
        # broadcast_params = result[:success] ?
        result = { success: true, idx: 1 }
        broadcast_params = result[:success] ?
          { status: result[:success], tx_id: result[:idx] } :
          { status: result[:success], broadcast_error: result[:message] }

        Success(params.merge(broadcast_params))
      end
    end
  end
end
