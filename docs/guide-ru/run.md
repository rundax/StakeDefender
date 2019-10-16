# Запуск
## на хост-машине
Для запуска системы на хост-машине необходимо установить недостающие программные пакеты:
 * nodejs - не ниже 10 ([инструкция](https://nodejs.org/en/download/package-manager/))
 * leveldb - v1.20 ([инструкция](https://gist.github.com/danil-lashin/9df600cb2d1fe8e503aae60fc0d6e209))
 
Подготовка и запуск:
 * Скачиваем линукс-версию бинарника [Minter ноды](https://github.com/MinterTeam/minter-go-node/releases)
 * Разпаковываем в удобное место (к примеру, /home/minter/bin)
 * Меняем имя бинарника в формат minter_{версия блокчейна}_linux_amd64 (к примеру minter_1.0.4_linux_amd64)
 * Скачиваем последний релиз [Minter Stake Defender](https://github.com/rundax/StakeDefender/releases)
 * Создаем рядом с app.js файл `.env` и заполняем переменные окружения
 * [Пример](https://github.com/rundax/StakeDefender/blob/master/.env.dist) заполненого `.env` 
 * [Посмотреть описание](env-vars.md) всех переменных в проекте
 * Запускаем приложение командой `node app.js`
 * Если все успешно, в логах должны быть примерно следующие строки:
 ```text
 Load env vars from file: /app/StakeDefender/.env
[2019-10-06 09:06:27.187][debug][application] Hello app [{"version":1.0.0,"env":"development"}]
 ```
 

## Docker
 
*  TODO 
