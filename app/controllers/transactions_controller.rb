# frozen_string_literal: true

class TransactionsController < ApplicationController
  def show
  end

  def new
    @transaction = Transaction.new
  end

  def create
  end

  private
    # Only allow a list of trusted parameters through.
    def transaction_params
      params.require(:transaction).permit(:email, :destination, :exchange_rate, :original,
        :exchanged, :network_fee, :exchanged_fee)
    end
end
