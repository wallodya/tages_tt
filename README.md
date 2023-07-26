# Тестовое задание для компании TAGES

Сортировка выполняется по возрастанию в лексикографическом порядке, например `[ "9", "11", "10" ]` отсортируется как `[ "10", "11", "9" ]`.
На вход принимается файл с любыми строками, разделенными символом указанным в конфигурации (подробнее ниже).

*Допущение: предполагается, что размер каждой строки в отдельности не превышает `highWaterMark` входного потока (64Кб), если строки будут длинее, результат не гарантирован. Если отдельные строки будут весить больше, чем 500Мб (заданный в задаче объем RAM), программа не сможет их сравнить и отсортировать при заданных ограничениях.*

## Как установить локально

- склонировать репозиторий
- npm install

## Входной файл
Тестовый файл  со строками нужно назвать `input.txt` и поместить по адресу `./data/input.txt`. Также можно сгенерировать автоматически (описано ниже).

## Скрипты
- `npm run start`: запустит сортировку и поместит отсортитрованный файл на адресу `./data/output.txt`.
- `npm run start-bench`: то же, что и `start`, но дополнительно замерит пиковый RSS (Resident Set Size) и время на выполниние алгоритма и выведет в консоль после выполнения сортировки.
- `npm run test`: запустит тесты
- `npm run create`: создаст текстовый файл со строками по адресу `.data/input.txt` по заданной конфигурации (описано ниже).
- `npm run check`: проверит отсортирован ли выходной файл и сколько в нем элементов, результат проверки поместит в файл `./data/test-result.txt`.

## Конфигурация

В файле `constants.ts` можно задать значения переменных, определяющих название и путь до файлов ввода и вывода, символ, разделяющий строки в файле ввода и символ, которым нужно раазделить строки в файле вывода (разделяющие символы в фале ввода и файле вывода могут быть разными).

Также можно задать количество строк, которое сгенерирует команда `create` в переменной `MOCK_DATA_AMOUNT` (именно количество **строк** а не количество символов или размер файла).

Чтобы настроить генератор случайных строк: задать длину строк, используемые символы и тп нужно изменить объект с параметрами который передается конструктору класса `MockDataCreator` в файле `create-data.ts` (разделяющий символ лучше задавать в файле с константами, чтобы избежать путаницы).

**Подробнее о классе `MockDataCreator` и остальных используемых классах, их параметртах и методах прочитать в JSDoc комментариях.**