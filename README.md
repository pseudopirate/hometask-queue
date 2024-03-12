# NodeJS Test Task

## Start project

Установить зависимости (относящиеся только к typescript)

```
npm ci
```

Run project

```
npm start PORT
```

## Notes

*Recipients should receive messages in the same order as the request came from them*

Чтобы достигнуть этого, был реализован [consumer callbacks list](./src/queue.ts#L6). 

* При получении сообщения, проверям есть ли ожидающие потребители и [отправляем](./src/queue.ts#L18) сообщение. 
* Когда клиент хочет получить сообщение, клиент добавляется в consumers list и если в очереди уже есть сообщение - [отправляем](./src/queue.ts#L32) его.