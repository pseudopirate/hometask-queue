# NodeJS Test Task

## Start project

Install deps (typescript related)

```
npm ci
```

Run project

```
npm start PORT
```

## Notes

*Recipients should receive messages in the same order as the request came from them*
And [consumer callbacks list](./src/queue.ts#6) was added in order to achieve that. 

* Once a message received, we try to check if there are any pending consumers and [send](./src/queue.ts#18) that message. 
* Once a client wants to get a message, we add the client to the consumers list and try to [send](./src/queue.ts#32)
a message if there is any.