# frozen_string_literal: true

RSpec.describe TransactionsController do
  describe "#stats" do
    let!(:transaction1) { create :transaction, exchange_fee: 6000 }
    let!(:transaction2) { create :transaction,  exchange_fee: 5000 }
    let!(:transaction3) { create :transaction, exchange_fee: 10000, status: false }

    let(:expected_result) do
      {
        "exchangeFee" => "0.00011",
        "count" => 3,
        "successCount" => 2,
      }
    end

    it "answers with correct response" do
      response = get(:stats)
      expect(JSON.parse(response.body)).to eq expected_result
    end
  end
end
