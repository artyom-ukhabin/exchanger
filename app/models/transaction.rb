# frozen_string_literal: true

class Transaction < ApplicationRecord
  scope :success, -> { where("success = true") }

  class << self
    def exchange_fee_sum
      success.sum("exchange_fee")
    end
  end
end
