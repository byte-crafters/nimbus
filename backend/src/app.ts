import fastify from 'fastify';

const server = fastify({
    logger: true
});

server.get('/api/v1/health-check', async () => {
    return 'alive';
});

const start = async () => {
    try {
        await server.listen({ port: 3002 });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();