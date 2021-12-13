# Prerequisites
- `Ruby`
- `Openssl`
- `Rails`
- `Postgres`
- `Node`
- `Yarn`

# Launch
- Do `yarn`, `bundle`
- Create `database.yml` file from `database.example.yml` and configure it with your DB. Then do `rake db:create db:migrate`
- Generate private key with `rails c -> Bitcoin::Wallet::KeyManager.new.generate`
- Create `main_config.yml` file from `main_config.example.yml` and fill it with your random login and password for accessing
transaction index page 
- `rails s` + `bin/webpack`/`bin/webpack-dev-server` -> `localhost:3000`

# Comments (rus)
## Dry-stack
### Containers
- Если сделать `require 'dry/system/container'` - куча депрекейтедов в dry-configurable внутри гема
- Проблемы с конфигурацией при настройке контроллера - undefined method `component_dirs' for #<Dry::Configurable::Config:0x00007f949b1cfde0>
- Вывод - пока оставил контейнер с `Dry::Container::Mixin`
### Transaction
- Как оказывается, `dry-transaction` устарел, в дальнейшем нужно будет переписать на монады.

## Валидация
- В нормальных условиях простейшая валидация была бы на фронте средства html - можно, например, указать тип email - и
браузер сам проверит на похожесть на email.

## Тесты
Обычно я использую практику написания тестов перед кодом, однако в рамках данной задачи решено было сконцентрироваться
на функционале. Rspec подключен и первый тест написан - если возникнут вопросы по моей способности писать тесты - пишите.

Что бы я тестил в этом приложении:
- Все экшны контроллера. Основные пути возврата 200 и 422.
- Тесты на dry-операции - граничные случаи проще покрыть в них. Экшн контроллера create в таком случае - как и было отмечено
ранее - может содержать только один тест для покрытия взаимодействия операций и тестирования логики самого контроллера.
- Так же логично будет протестировать кастомные rules в `Contract::Transaction` и сразу проверить на нем ошибки валидации.
- Тест на BitcoinWallet - так как он немного отличается от прошлого скрипта. Возможно, только главный файл - без внутренних сервисов,
так как их работа уже была бы протестирована в первом репозитории.

## Функционал админа
Реализована только таблица со статистикой, под таблицу с транзакциями только заготовлен бойлерплейт.

## Ответы контроллера
Ответы в контроллере можно обернуть в декораторы, если в этом возникнет нужда. Также можно использовать jbuilder-вьюхи,
которые будут лежать в папке с view. Пока решено было оставить так, как есть.

## Дальнейшие улучшения
### Dry-stack
- Возможно, все мои зависимости из конструкторов и прайват методов можно было описать лучше через `dry-system` и `dry-container`.
Хоть они у меня и изолированы, а возможность подмены вряд ли понадобится, нельзя не признать, что с `dry-container`'ом смотрится чище.
- Возможно, использовать типы в операциях для большей наглядности
- Подключить `dry-rails` одним гемом
## Локализация
- Локализация приложения
- На фронт - не переводы ошибок, а ключи ошибок. Все переводы - на фронте.
## Функционал
- Покрыть спеками
- Линтеры и запуск линтеров и спеков на CI
- Докер-скрипт для запуска приложения
- Закончить функционал страницы администратора и добавить пагинацию во вторую таблицу
- Подключить Sequel (по надобности)
- Возможно декораторы и jbuilder-views
