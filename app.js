const Fastify = require('fastify')
const fastifyEnv = require('@fastify/env')

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

    // dotenv를 사용해서 환경변수를 읽어오기 위한 세팅
    const schema = {
        type: 'object',
        required: ['API_KEY'],
        properties: {
            API_KEY: {
                type: 'string'
            }
        }
    }
    const options = {
        confKey: 'config',
        schema: schema,
        dotenv: true,
        data: process.env
    }
    fastify.register(fastifyEnv, options).ready((err) => {
        if (err) console.log(err)

        console.log(fastify.config)
    })

    // 서버로 들어온 요청의 헤더가 환경변수에 등록된 API_KEY 값과 일치하는지 확인하기 위한 함수
    const isAuthorized = (request) => {
        const originApiKey = fastify.config['API_KEY']
        const apiKey = request.headers['x-api-key']
        return (originApiKey === apiKey) ? true : false
    }

    fastify.get('/', async (request, reply) => {
        reply.send({ hello: 'world' })
    });

    fastify.get('/user', async (request, reply) => {
        if (isAuthorized(request)) {
            const data = getData('writer')
            reply.send(data)
        } else {
            reply.send('not authorized')
        }
    });

    fastify.get('/webtoon', async (request, reply) => {
        if (isAuthorized(request)) {
            const data = getData('webtoon')
            reply.send(data)
        } else {
            reply.send('not authorized')
        }
    });

    fastify.get('/webtoon-read', async (request, reply) => {
        if (isAuthorized(request)) {
            const data = getData('webtoonRead')
            reply.send(data)
        } else {
            reply.send('not authorized')
        }
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