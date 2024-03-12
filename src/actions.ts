import type { ServerResponse } from 'http';
import queue from './queue';

export function respond(res: ServerResponse, statusCode: number, body?: string) {
    res.statusCode = statusCode;
    res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

export function putMessage(res: ServerResponse, name: string, value: string) {
    queue.add(name, value);
    return respond(res, 200);
}

// timeout is in seconds
export function getMessage(res: ServerResponse, name: string, timeout: number) {
    let timeoutId: NodeJS.Timeout;

    const recieveMessage = (msg: string) => {
        clearTimeout(timeoutId);
        respond(res, 200, msg);
    };

    timeoutId = setTimeout(() => {
        queue.unsubscribe(name, recieveMessage);
        respond(res, 404);
    }, timeout * 1000);
    
    return queue.recieve(name, recieveMessage);
}
