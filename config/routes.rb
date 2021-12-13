# frozen_string_literal: true

Rails.application.routes.draw do
  resources :transactions, only: %i[new show create index] do
    collection do
      get :stats
      get :all
    end
  end

  root "transactions#new"
end
