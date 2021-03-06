# frozen_string_literal: true

class TransactionsController < ApplicationController
  http_basic_authenticate_with name: MainConfig.tx_stats.login,
    password: MainConfig.tx_stats.password,
    only: %i[index]

  def index
    @params_hash = {
      statsUrl: stats_transactions_path,
      allTransactionsUrl: all_transactions_path,
    }
  end

  def show
    transaction = Transaction.find(params[:id])
    @params_hash = {
      originalSum: transaction.original_sum,
      exchangedSum: BitcoinWallet::BtcFormatter.format(transaction.exchanged_sum),
      exchangeRate: transaction.exchange_rate,
      destination: transaction.destination,
      networkFee: BitcoinWallet::NETWORK_FEE,
      exchangeFee: BitcoinWallet::BtcFormatter.format(transaction.exchange_fee),
      txId: transaction.tx_id,
    }
  end

  def new
    bitcoin_wallet = BitcoinWallet.new
    @params_hash = {
      networkFee: BitcoinWallet::NETWORK_FEE,
      exchangeFeePercent: BitcoinWallet::EXCHANGE_FEE_PERCENT,
      walletBalance: bitcoin_wallet.get_balance,
      createUrl: transactions_path,
      exchangeRateApiUrl: BitcoinWallet::EXCHANGE_RATE_API_URL,
    }
  end

  def create
    create_transaction.call(transaction_params.to_h) do |result|
      result.success do |transaction|
        render json: { showUrl: transaction_path(transaction.id) }
      end

      result.failure :validate do |errors|
        render json: { errors: format_errors(errors) }, status: :unprocessable_entity
      end

      result.failure do |error|
        render json: { errors: format_errors(general: error) }, status: :unprocessable_entity
      end
    end
  end

  def stats
    stats = {
      exchangeFee: BitcoinWallet::BtcFormatter.format(Transaction.exchange_fee_sum),
      count: Transaction.count,
      successCount: Transaction.success.count,
    }
    render json: stats.to_json
  end

  def all
    {}
  end

  private

  def create_transaction
    Transactions::Transaction::Create.new
  end

  def transaction_params
    params.require(:transaction).permit(
      :email,
      :destination,
      :exchange_rate,
      :original_sum,
      :exchanged_sum,
      :network_fee,
      :exchange_fee,
      :terms_checked,
    )
  end

  def format_errors(errors)
    errors.stringify_keys.transform_keys{ |key| key.camelize(:lower) }
  end
end
