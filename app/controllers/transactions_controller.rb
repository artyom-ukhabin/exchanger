# frozen_string_literal: true

class TransactionsController < ApplicationController
  def show
    @transaction = Transaction.find(params[:id])
  end

  def new
    # camelize params? В геме был метод
    @params_hash = {
      networkFee: 0.000006, # в константу
      createUrl: transactions_path,
    }
  end

  def create
    transaction = Transaction.create(transaction_params) # + default params
    # создать объект формы с валидациями
    redirect_to action: :show, id: transaction.id
  end

  private
    # Only allow a list of trusted parameters through.
    def transaction_params
      params.permit(:email, :destination, :exchange_rate, :original,
        :exchanged, :network_fee, :exchanged_fee)
      # был require
      # params.require(:transaction).permit(:email, :destination, :exchange_rate, :original,
      #   :exchanged, :network_fee, :exchanged_fee)
    end
end
