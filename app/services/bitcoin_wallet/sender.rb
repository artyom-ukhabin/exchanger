# frozen_string_literal: true

class BitcoinWallet
  class Sender
    NETWORK_FEE = 600

    def initialize
      @stats = Stats.new
      @builder = Builder.new
      @client = Client.new
    end

    def pay(wallet, addr_to, amount, exchanged_fee)
      utxo_data = @stats.confirmed_utxo(wallet.addr)

      balance = @stats.balance(wallet.addr)
      fee = calculate_fee(exchanged_fee)
      unless able_to_pay?(balance, amount, fee)
        return { success: false, message: low_balance_message(balance, amount) }
      end

      tx = @builder.pay_transaction(
        wallet: wallet,
        addr_to: addr_to,
        utxo: utxo_data,
        balance: balance,
        amount: amount,
        fee: fee,
        )
      push(tx)
    end

    private

    def calculate_fee(exchanged_fee)
      exchanged_fee + NETWORK_FEE
    end

    def able_to_pay?(balance, amount, fee)
      balance > (amount + fee)
    end

    def low_balance_message(balance, amount)
      "Unable to send money: balance is lower than sending amount:\n" \
      "Balance: #{BtcFormatter.format(balance)}\n" \
      "Amount: #{BtcFormatter.format(amount)}\n" \
      "Fee: #{BtcFormatter.format(NETWORK_FEE)}\n"
    end

    def push(tx)
      path = "push/transaction"
      body = { data: CGI.escape(tx.to_payload.bth) }
      result = @client.post(path, body)
      result[:success] ?
        { success: true, idx: result[:response]["data"]["transaction_hash"] } :
        { success: false, status: result[:response].status, message: result[:response].body }
    end
  end
end
