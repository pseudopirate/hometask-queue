
type MessageCallback = (msg: string) => void;

export class QueueBroker {
    private messages = new Map<string, string[]>();
    private consumers = new Map<string, MessageCallback[]>();

    // add a message to the queue
    add(name: string, value: string) {
        const messages = this.messages.get(name);
        if (messages) {
            messages.push(value);
        } else {
            this.messages.set(name, [value]);
        }

        // try to send messages once a new message is added
        this.send(name);
    }

    // add a consumer callback
    recieve(name: string, callback: MessageCallback) {
        const consumers = this.consumers.get(name);

        if (consumers) {
            consumers.push(callback);
        } else {
            this.consumers.set(name, [callback]);
        }

        // try to send pending messages once a new consumer is added
        this.send(name);
    }

    // check if there are any consumers and pending messages in queue "name" and send them
    send(name: string) {
        const consumers = this.consumers.get(name);
        const messages = this.messages.get(name);

        if (consumers && messages) {
            while (consumers.length > 0 && messages.length > 0) {
                const consumer = consumers.shift();
                const message = messages.shift();

                if (consumer && message) {
                    consumer(message);
                }
            }
        }
    }

    // remove consumer
    unsubscribe(name: string, callback: MessageCallback) {
        const queue = this.consumers.get(name);

        if (queue) {
            const index = queue.indexOf(callback);

            if (index > -1) {
                queue.splice(index, 1);
            }
        }
    }
}

export default new QueueBroker();
