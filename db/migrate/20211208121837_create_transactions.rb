# frozen_string_literal: true

class CreateTransactions < ActiveRecord::Migration[6.1]
  def change
    create_table :transactions do |t|
      t.string :email, null: false
      t.string :destination, null: false
      t.string :from, null: false
      t.string :to, null: false
      t.float :exchange_rate, null: false
      t.bigint :original_sum, null: false
      t.bigint :exchanged_sum, null: false
      t.bigint :network_fee, null: false
      t.bigint :exchange_fee, null: false
      t.string :tx_id, null: false
      t.boolean :status, null: false
      t.timestamp :created_at, null: false
    end
  end
end
