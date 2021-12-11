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
    # camelize params? В геме был метод
    @params_hash = {
      networkFee: 0.000006, # в константу
      createUrl: transactions_path,
    }
  end

  def create
    create_transaction.call do |result|
      result.success do |transaction|
        render json: { showUrl: transaction_path(transaction.id) }
      end

      result.failure :validate do |errors|
        render json: { errors: errors }, status: :unprocessable_entity
      end

      result.failure do |error| # исключением
        render json: { errors: error }, status: :internal_server_error
      end
    end
  end

  private

  def create_transaction # контейнер?
    Transactions::Transaction::Create.new
  end

  def transaction_params
    params.require(:transaction).permit(
      :email,
      :destination,
      :exchange_rate,
      :original,
      :exchanged,
      :network_fee,
      :exchanged_fee
    )
  end
end
