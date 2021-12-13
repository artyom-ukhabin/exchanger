# frozen_string_literal: true

module MainConfig
  extend self

  def respond_to_missing?(name, *)
    setting(name).present? || super
  end

  def method_missing(name, *)
    setting(name) || super
  end

  private

  def setting(name)
    config.public_send(name)
  end

  def config(project = :default)
    @project_configs ||= {}
    @project_configs[project] ||= begin
      project_hash = project ? config_hash[project.to_sym] : nil
      hash = project_hash ? config_hash.deep_merge(project_hash) : config_hash
      RecursiveOpenStruct.new(hash)
    end
  end

  def config_hash
    @config ||= begin
      path = Rails.root.join("config/main_config.yml")
      config = YAML.safe_load(ERB.new(IO.read(path)).result, [Symbol], [], true)
      config.fetch("default", {}).deep_merge(config.fetch(Rails.env, {})).deep_symbolize_keys
    end
  end
end
