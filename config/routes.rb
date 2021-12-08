# frozen_string_literal: true

Rails.application.routes.draw do
  resources :transactions, only: %i[new show create]

  root "transactions#new"
end
