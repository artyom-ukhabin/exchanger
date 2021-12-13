# frozen_string_literal: true

class BitcoinWallet
  EXCHANGE_RATE_API_URL = "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USDT"
  NETWORK_FEE = BtcFormatter.format(Sender::NETWORK_FEE)
  EXCHANGE_FEE_PERCENT = 0.03

  def initialize
    Bitcoin.network = :testnet3

    @wallet = nil
    @key_manager = KeyManager.new
    @sender = Sender.new
    @stats = Stats.new
    @wallet = @key_manager.load
  end

  def pay(addr_to, amount_sat, exchanged_fee_sat)
    @sender.pay(@wallet, addr_to, amount_sat, exchanged_fee_sat)
  end

  def get_balance
    BtcFormatter.format(@stats.balance(@wallet.addr))
  end

  def btc_to_satoshi(btc_sum)
    (btc_sum * BtcFormatter::BTC_DELIMITER).to_i
  end
end
