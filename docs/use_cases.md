# Розроблення функціональних вимог до системи

## Модель прецедентів

### 1. Загальна схема

```plantuml
@startuml

    actor "Guest" as Guest
    actor "User" as User
    actor "Tech Expert" as Expert

    usecase "<b>USER_LOGIN</b>\nВхід користувача до системи" as UC_1
    usecase "<b>USER_REG</b>\nРеєстрація облікового запису користувача в системі" as UC_2
    usecase "<b>USER_LOGOUT</b>\nВихід користувача з системи" as UC_3
    usecase "<b>USER_SEARCH_REQUEST</b>\nПошук контенту" as UC_4
    usecase "<b>USER_ACCOUNT_DELETE</b>\nВидалення облікового запису користувача" as UC_5
    usecase "<b>USER_MEDIA_CREATE</b>\nКористувач створює новий\n медіа-контент в системі" as UC_6
    usecase "<b>USER_MEDIA_DELETE</b>\nКористувач видаляє наявний медіа-контент" as UC_7
    usecase "<b>USER_MEDIA_EDIT</b>\nКористувач редагує інформацію про медіа-контент" as UC_8
    usecase "<b>USER_SUPPORT</b>\nКористувач звертається до технічної підтримки" as UC_9
    usecase "<b>USER_ACCOUNT_BAN</b>\nВидалення облікового запису\n користувача технічним експертом" as UC_10

    User -l-|> Guest
    Expert -r-|> Guest

    Guest -d-> UC_1
    Guest -u-> UC_2

    User -u-> UC_3
    User -u-> UC_4
    User -u-> UC_5
    User -r-> UC_6
    User -d-> UC_7
    User -d-> UC_8
    User -d-> UC_9

    Expert -d-> UC_9
    Expert -l-> UC_10
@enduml
```

<div align="center">
Рис. 1 Діаграма прецедентів
</div>

### 2. Схема використання для гостя

```plantuml
@startuml

    actor "Guest" as Guest

    usecase "<b>USER_LOGIN</b>\nВхід користувача до системи" as UC_1
    usecase "<b>USER_REG</b>\nРеєстрація облікового запису користувача в системі" as UC_2

    Guest -d-> UC_1
    Guest -d-> UC_2
@enduml
```
<div align="center">
Рис. 2 Схема можливостей гостя
</div>

### 3. Схема використання для користувача

```plantuml
@startuml

    actor "User" as User

    usecase "<b>USER_LOGOUT</b>\nВихід користувача з системи" as UC_3
    usecase "<b>USER_SEARCH_REQUEST</b>\nПошук контенту" as UC_4
    usecase "<b>USER_ACCOUNT_DELETE</b>\nВидалення облікового запису користувача" as UC_5
    usecase "<b>USER_MEDIA_CREATE</b>\nКористувач створює новий\n медіа-контент в системі" as UC_6
    usecase "<b>USER_MEDIA_DELETE</b>\nКористувач видаляє наявний медіа-контент" as UC_7
    usecase "<b>USER_MEDIA_EDIT</b>\nКористувач редагує інформацію про медіа-контент" as UC_8
    usecase "<b>USER_SUPPORT</b>\nКористувач звертається до технічної підтримки" as UC_9

    User -u-> UC_3
    User -u-> UC_4
    User -u-> UC_5
    User -r-> UC_6
    User -d-> UC_7
    User -d-> UC_8
    User -d-> UC_9

@enduml
```

<div align="center">
Рис. 3 Схема можливостей користувача
</div>

### 4. Схема використання для технічного експерта

```plantuml
@startuml

    actor "Tech Expert" as Expert

    usecase "<b>USER_SUPPORT</b>\nКористувач звертається до технічної підтримки" as UC_9
    usecase "<b>USER_ACCOUNT_BAN</b>\nВидалення облікового запису\n користувача технічним експертом" as UC_10

    Expert -d-> UC_9
    Expert -d-> UC_10
@enduml
```

<div align="center">
Рис. 4 Схема можливостей технічного експерта
</div>


### 5. Сценарії використання для незареєстрованого користувача (гостя)
### Реєстрація
**ID**: UserReg

**НАЗВА**: Реєстрація облікового запису

**УЧАСНИКИ**: Користувач, Система

**ПЕРЕДУМОВИ**: Користувач відсутній в системі

**РЕЗУЛЬТАТ**: Створений обліковий запис

**ВИНЯТКОВІ СИТУАЦІЇ**: 
1. Користувач існує в системі - AlreadyRegisteredException
2. Користувач реєструється без введеня даних потрібних для реєстрації - DataMissingException
3. Ведденя некореткних даних користувачем - InvalidDataException

**СЦЕНАРІЙ** :
1. Користувач запускає сторінку реєстрації 
2. Користувач вводить особисті дані. Наприклад: електронну почту, ім'я, прізвище і т.д.
3. Система перевіряє наявність користувача з такими ж даними, що існуть в системі
4. Система створює обліковий запис 
5. Система вказує користувачу, що обліковий запис було створено

<center>

@startuml

|Гість|
start
: Користувач натискає кнопку "Реєстрація";
: Користувач передає реєстраційні дані;

note left #red
<b>Можлива виключна ситуація</b>
<b>"InvalidDataException"</b>
end note

: Користувач натискає кнопку "Підтвердити реєстрацію";

|Система|
: Система отримує запит на реєстрацію;
: Перевірка реєстраційних данних;
note right #ff0000
<b>Можлива виключна ситуація</b>
<b>"DataMissingException"</b>
end note
: Система перевіряє наявність облікового запису;
note right #ff0000
<b>Можлива виключна ситуація</b>
<b>"AlreadyRegisteredException"</b>
end note
: Система створює обліковий запис;
: Система вказує на створення облікового запису;

|Гість|
stop

@enduml

**Рис. 5.1** Сценарій реєстрації користувача

</center>

### Вхід

**ID**: UserLog

**НАЗВА**: Вхід до облікового запису

**УЧАСНИКИ**: Користувач, Система

**ПЕРЕДУМОВИ**: Користувач наявний в системі

**РЕЗУЛЬТАТ**: Вхід до облікового запису

**ВИНЯТКОВІ СИТУАЦІЇ**:
1. Введеня некоректних даних - DataNotFoundException
2. Користувача немає в системі - NotRegisteredException
3. Користувач виконав забагато спроб входу до облкіового запису з помиклою в результаті - TooManyActionsException

**СЦЕНАРІЙ** :
1. Користувач відкриває сторінку входу
2. Користувач вводить дані для входу
3. Перевірка на наявність обліково запису
4. Перевірка на правильність
5. Виконання входу в облікову систему

<center>

@startuml

|Гість|
start
: Користувач натискає кнопку "Вхід";
: Користувач вводить авторизаційні дані;

note left #red
<b>Можлива виключна ситуація</b>
<b>"TooManyActionsException"</b>
end note

: Користувач натискає кнопку "Увійти";

|Система|
: Система отримує запит на вхід у обліковий запис;
: Система перевіряє отримані дані;
note right #ff0000
<b>Можлива виключна ситуація</b>
<b>"DataNotFoundException"</b>
end note
: Перевірка на наявність облікового запису;
note right #ff0000
<b>Можлива виключна ситуація</b>
<b>"NotRegisteredException"</b>
end note
: Система надає доступ до сторінки кабінету;
: Система повідомляє про успішний вхід в особистий кабінет;

|Гість|
stop

@enduml

**Рис. 5.2** Сценарій авторизації користувача

</center>

</center>
### 6. Сценарії використання для користувача
// (USER_LOGOUT, USER_SEARCH_REQUEST, USER_ACCOUNT_DELETE, USER_MEDIA_CREATE, USER_MEDIA_DELETE, USER_MEDIA_EDIT, USER_SUPPORT)
### 7. Сценарії використання для технічного експерта
// (USER_ACCOUNT_BAN)
