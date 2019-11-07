const fastify = require('fastify')({logger: true});

fastify.register(require('../../index.js')); // Require fastify-squirrelly here!

fastify.get('/', (req, reply) => {
  reply.sqrly('hello', {name: 'World'});
});

fastify.listen(3000, err => {
  if(err) throw err;
});
