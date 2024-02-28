import fastify from 'fastify';
import fastifyStatic from "@fastify/static";
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocket } from 'ws';
import { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const f = fastify()

const wss = new WebSocketServer({ server : f.server })

wss.on(`connection`, client => {
    client.on(`message`, (data) => {
        const parsedData = JSON.parse(data.toString())
        wss.clients.forEach(c => {
            if(c !== client) {
            c.send(JSON.stringify({...parsedData}))
        }
        })
    })
})

f.register(fastifyStatic, {
    root: path.join(__dirname, '../client'),
  })

const port = process.env.PORT || 5555;
const host = process.env.HOST || `localhost`

f.listen({ port, host }, (err, adress) => {
    if(err) {
        console.log(`Oops`, err)
        return
    }
    console.log(adress)
})
