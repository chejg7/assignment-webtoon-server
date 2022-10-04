const Fastify = require('fastify')

const writer_1 = require('./data/writer_1.json')
const webtoon_1 = require('./data/webtoon_1.json')
const webtoonRead_1 = require('./data/webtoon-read_1.json')
const writer_2 = require('./data/writer_2.json')
const webtoon_2 = require('./data/webtoon_2.json')
const webtoonRead_2 = require('./data/webtoon-read_2.json')

function getData(data) {
    const date = new Date();
    const min = date.getMinutes()
    const period = (min >=0 && min < 10)? 1 : (min >= 10 && min < 20)? 2 : (min >= 20 && min < 30)? 3 : (min >= 30 && min < 40)? 1 : (min >= 40 && min < 50)? 2 : 3;
    
    if (data === 'writer') {
        return period === 1 ? writer_1 : period === 2 ? writer_2 : [...writer_1, ...writer_2];
    } else if (data === 'webtoon') {
        return period === 1 ? webtoon_1 : period === 2 ? webtoon_2 : [...webtoon_1, ...webtoon_2];
    } else if (data === 'webtoonRead') {
        return period === 1 ? webtoonRead_1 : period === 2 ? webtoonRead_2 : [...webtoonRead_1, ...webtoonRead_2];
    } else {
        return;
    }
}

function init() {
    const fastify = Fastify({
        logger: true
    });

    fastify.get('/', async (request, reply) => {
        reply.send({ hello: 'world' })
    });

    fastify.get('/user', async (request, reply) => {
        const data = getData('writer')
        reply.send(data)
    });

    fastify.get('/webtoon', async (request, reply) => {
        const data = getData('webtoon')
        reply.send(data)
    });

    fastify.get('/webtoon-read', async (request, reply) => {
        const data = getData('webtoonRead')
        reply.send(data)
    });

    return fastify;
}

if (require.main === module) {
    (async () => {
        try {
            await init().listen({ port: 4000 })
        } catch (err) {
            init().log.error(err)
            process.exit(1)
        }
    })();
} else {
    module.exports = init;
}