# frozen_string_literal: true

Dry::Rails.container do
  config.features = %i[
    application_contract
    controller_helpers
  ]

  auto_register!("app/contracts")
  auto_register!("app/transactions")
end
