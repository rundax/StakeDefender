# Сборка проекта
## Запуск кода без компиляции
Для запуска кода без сборки его в js bundle в консоли нужно выполнить команду `node -r ts-node/register -r tsconfig-paths/register src/index.ts`

Если используется WebStorm то выберается  интерпритатор nodejs в docker-compose контейнере. В поле `Node parameters` вставляется `-r ts-node/register -r tsconfig-paths/register` для корректного запуска и отладки
