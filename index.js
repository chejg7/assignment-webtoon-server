const Fastify = require('fastify')

function init() {
    const fastify = Fastify({
        logger: true
    });

    fastify.get('/', async (request, reply) => {
        reply.send({ hello: 'world' })
    });

    fastify.get('/user', async (request, reply) => {
        reply.send({ massage: '유저 정보를 반환합니다'})
    });

    fastify.get('/webtoon', async (request, reply) => {
        reply.send({ massage: '웹툰 정보를 반환합니다'})
    });

    fastify.get('/webtoon-read', async (request, reply) => {
        reply.send({ massage: '이용내역 정보를 반환합니다'})
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