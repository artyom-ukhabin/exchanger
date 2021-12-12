# frozen_string_literal: true

module Contracts
  class ApplicationContract < Dry::Validation::Contract
    EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i

    register_macro(:email_format) do
      unless EMAIL_REGEX.match?(value)
        key.failure('not a valid email format')
      end
    end

    config.messages.default_locale = :en
  end
end
