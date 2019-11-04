const fastify = require('fastify')({logger:true});
fastify.register(require('../index.js'));

fastify.get('/', async (request, reply) => {
  reply.nuts('hello-world', {name: 'World'});
});

const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start();