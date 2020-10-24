# Переменые окружения

Система состоит из разных модулей, которые гибко настраиваются [переменными окружения](https://wiki.archlinux.org/index.php/Environment_variables_(%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9))
Каждый модуль может работать отдельно от остальных.

## Глобальные
| Название переменной | Тип    | Значение по умолчанию       | Описание                                                                                                                               |
|:--------------------|:-------|:----------------------------|:---------------------------------------------------------------------------------------------------------------------------------------|
| APP_NAME            | string | app                         | Уникальный идентификатор инстанса приложения. Исполльзуется в нотификации и для отлавливания ошибок                                    |
| APP_DEBUG           | bool   | false                       |                                                                                                                                        |
| APP_ENV             | string |                             | Название окружения, в котором запускается система                                                                                      |
| APP_VALIDATOR_NAME  | string | undefined                   | Имя валидатора - для отображения в сообщениях                                                                                          |
| APP_SENTRY_ENABLED  | bool   | false                       | Флаг для включения системы мониторинга ошибок [Sentry](https://sentry.io)                                                              |
| APP_SENTRY_DSN      | string | https://fake@fake.local/123 | Токен для отправки ошибок в Sentry ([подробности](https://docs.sentry.io/error-reporting/quickstart/?platform=node#configure-the-sdk)) |
| REDIS_HOST          | string | redis                       | Имя хоста для подключения к redis                                                                                                      |
| REDIS_PORT          | number | 6379                        | Порт подключения к redis                                                                                                               |
| REDIS_DB            | number | 2                           | Номер базы данных                                                                                                                      |
| REDIS_PREFIX        | string | cache_                      | Перфикс в имени ключей                                                                                                                 |
 
 
| Название переменной           | Тип                       | Значение по умолчанию | Описание                                              |
|:------------------------------|:--------------------------|:----------------------|:------------------------------------------------------|
| APP_NODE_NETWORK              | enum(testNet или mainNet) | testNet               | Тип сети. Участвует в подписании транзакции           |
| APP_NODE_API_TYPE             | enum(node или gate)       | gate                  | Тип подключения к ноде. Гейт или апи ноды             |
| APP_NODE_BASE_URL             | string                    | http://localhost:8841 | Базоый URL для запроса к ноде                         |
| APP_NODE_PUBLIC_KEY_VALIDATOR | string                    | пустая строка         | Публичный ключ для подписи транзакций setCandidateOff |
| APP_NODE_PRIVATE_KEY          | string                    | пустая строка         | Приватный ключ для подписи транзакций setCandidateOff |
| APP_NODE_API_DEBUG_PROXY      | boolean                   | false                 | Включение проксирования запросов к апи                |
| APP_NODE_API_DEBUG_PROXY_HOST | string                    | 127.0.0.1             | Хост прокси сервера                                   |
| APP_NODE_API_DEBUG_PROXY_PORT | number                    | 9000                  | Порт прокси сервера                                   |

## Модуль мониторинга
| Название переменной                               | Тип                        | Значение по умолчанию | Описание                                                                            |
|:--------------------------------------------------|:---------------------------|:----------------------|:------------------------------------------------------------------------------------|
| APP_MONITORING_SPLASH_CHECKER_ENABLED             | bool                       | true                  | Включает модуль проверки пропуска блоков и отключения ноды                          |
| APP_MONITORING_SPLASH_CHECKER_ADDRESS             | string                     | пустая строка         | Адрес, за которым будет следить модуль                                              |
| APP_MONITORING_SPLASH_CHECKER_SKIPPED_BLOCK_LIMIT | number                     | 10                    | Количество пропущенных блоков, после когорого будет сгенерирован ивент о выключении |
| APP_MONITORING_BLOCK_NOTIFY_ENABLED               | bool                       | default               | Включает модуль проверки наличия новых блоков по апи                                |
| APP_MONITORING_BLOCK_NOTIFY_REQUEST_INTERVAL      | number(ms)                 | 1000(ms)              | Как часто спрашивать апи о новом блоке                                              |

## Модуль уведомлений 
| Название переменной         | Тип    | Значение по умолчанию | Описание                                                                                                                                   |
|:----------------------------|:-------|:----------------------|:-------------------------------------------------------------------------------------------------------------------------------------------|
| APP_NOTIFY_ENABLED          | bool   | false                 | Влкючение модуля нотификации                                                                                                               |
| APP_NOTIFY_TELEGRAM_ENABLED | bool   | false                 | Включение модуля нотификации в телеграм                                                                                                    |
| APP_NOTIFY_TELEGRAM_CHAT_ID | string | пустая строка         | ID чата, в который слать уведомления( [инструкция](https://stackoverflow.com/questions/32423837/telegram-bot-how-to-get-a-group-chat-id) ) |
| APP_NOTIFY_TELEGRAM_TOKEN   | string | пустая строка         | Токен телеграм бота ([инструкция](https://core.telegram.org/bots))                                                                         |
