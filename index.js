const Fastify = require('fastify')
const writer = require('./data/writer_1.json')
const webtoon = require('./data/webtoon_1.json')
const webtoonRead = require('./data/webtoon-read_1.json')

function init() {
    const fastify = Fastify({
        logger: true
    });

    fastify.get('/', async (request, reply) => {
        reply.send({ hello: 'world' })
    });

    fastify.get('/user', async (request, reply) => {
        reply.send({ writer })
    });

    fastify.get('/webtoon', async (request, reply) => {
        reply.send({ webtoon })
    });

    fastify.get('/webtoon-read', async (request, reply) => {
        reply.send({ webtoonRead })
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