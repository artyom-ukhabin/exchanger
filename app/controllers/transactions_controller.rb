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
    # транзакция на три шага: запрос, валидация, сохранение в базу
    # отдельные классы сервиса и формы для использования в первых двух операциях


    # запрос по http в рамках сохранения формы для получения статуса
    form = TransactionForm.new(transaction_params)

    if form.valid?
      transaction = form.create!
      render json: { showUrl: transaction_path(transaction.id) }
    else
      render json: { errors: form.errors.messages }, status: :unprocessable_entity
    end
  end

  private

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
