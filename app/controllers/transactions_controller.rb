# frozen_string_literal: true

class TransactionsController < ApplicationController
  # базовая авторизация only: %[index], креды в конфиге, не в репе

  def index
    # jbuilder view
    # пагинация на обе таблицы - отдельные экшны или в этом?
  end

  def show
    @transaction = Transaction.find(params[:id])
    # jbuilder view
  end

  def new
    bitcoin_wallet = BitcoinWallet.new
    # camelize params? В геме был метод
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

      result.failure do |error| # исключением?
        render json: { errors: format_errors(errors) }, status: :internal_server_error
      end
    end
  end

  private

  def create_transaction # контейнер?
    Transactions::Transaction::Create.new
  end

  def transaction_params
    # нужно добавить передачу exchanged_sum и fee
    params.require(:transaction).permit(
      :email,
      :destination,
      :exchange_rate,
      :original_sum,
      :exchanged_sum,
      :network_fee,
      :exchanged_fee,
      :terms_checked,
    )
  end

  # в декоратор?
  def format_errors(errors)
    errors.stringify_keys.transform_keys{ |key| key.camelize(:lower) }
  end
end
