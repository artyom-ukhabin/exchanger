# frozen_string_literal: true

FactoryBot.define do
  factory :transaction do
    sequence(:id) { |n| n }
    sequence(:email) { |n| "email#{n}@a.com"}
    sequence(:destination) { |n| "address_#{n}" }
    from { "USDT" }
    to { "tBTC" }
    exchange_rate { 1 }
    original_sum { 10 }
    exchanged_sum { 10 }
    exchange_fee { 1000 }
    network_fee { 4000 }
    tx_id { |n| "tx_#{n}@a.com" }
    status { true }
    created_at { DateTime.current }
  end
end
