import http from 'http';
import { parse as parseUrl } from 'url';
import { getMessage, putMessage, respond } from './actions';

const PORT = process.argv[2] || 5050;

const queueNameRegex = /^\/[a-z0-9]+$/i;

const server = http.createServer((req, res) => {
    // Parse and validate URL
    const { pathname, query } = parseUrl(req.url || '', true);

    if (!pathname || !queueNameRegex.test(pathname)) {
        return respond(res, 404, 'not found');
    }

    const queueName = pathname.slice(1);

    if (req.method === 'PUT') {
        // validate value and put message in the queue
        const value = query.v;
        return value && typeof value === "string" 
            ? putMessage(res, queueName, value) 
            : respond(res, 400);

    } else if (req.method === 'GET') {
        // validate timeout and get message 
        const timeout = query.timeout && query.timeout === typeof "string"
            ? parseInt(query.timeout)
            : 30; // 30 seconds default

        return Number.isNaN(timeout) || timeout < 0
            ? respond(res, 400)
            : getMessage(res, queueName, timeout);
    }


    return respond(res, 404, 'not found');
});

server.on('clientError', (err, socket) => {
    if (("code" in err && err.code === 'ECONNRESET') || !socket.writable) {
        return;
    }

    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
}); 


server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
