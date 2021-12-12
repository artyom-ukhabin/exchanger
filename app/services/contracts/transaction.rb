# frozen_string_literal: true

module Contracts
  class Transaction < ApplicationContract
    params do
      required(:email).filled(:string)
      required(:destination).filled(:string)
      required(:original_sum).filled(:float)
      required(:exchanged_sum).filled(:float)
      required(:exchanged_fee).filled(:float)
      required(:terms_checked).filled(:bool)
    end

    rule(:email).validate(:email_format)

    rule(:original_sum) do
      if value > 30
        key.failure('need to be less then 30 USDT')
      end
    end

    rule(:terms_checked) do
      unless value
        key.failure('terms need to be checked')
      end
    end
  end
end
