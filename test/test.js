const t = require('tap');
const test = t.test;
const Fastify = require('fastify');
const sget = require('simple-get').concat

test('sqrly method exists on reply', t => {
  t.plan(5);
  const fastify = Fastify();
  fastify.register(require('../index'), {})
  fastify.get('/', (req, reply) => {
    t.ok(reply.sqrly);
    reply.send({ hello: 'world'});
  });

  fastify.listen(0, err => {
    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.error(err);
      t.strictEqual(response.statusCode, 200);
      t.strictEqual(response.headers['content-length'], '' + body.length);
      t.deepEqual(JSON.parse(body), { hello: 'world' });
      fastify.close()
    });
  });
});


test('return a 500 if the template is missing', t => {
  t.plan(2)
  const fastify = Fastify();
  fastify.register(require('../index'));
  fastify.get('/', (req, reply) => {
    reply.sqrly('not-real', {});
  });
  fastify.listen(0, err => {
    t.error(err);
    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.strictEqual(response.statusCode, 500);
      fastify.close();
    });
  });
});

test('Return compiled template', t => {
  t.plan(3)
  const fastify = Fastify();
  fastify.register(require('../index'));
  fastify.get('/', (req, reply) => {
    reply.sqrly('hello', {name: 'World'});
  });
  fastify.listen(0, err => {
    t.error(err);
    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.strictEqual(response.statusCode, 200);
      t.strictEqual(body.toString(), `<h1>Hello, World!</h1>`);
      fastify.close();
    });
  });
});

test('Return nested compiled template', t => {
  t.plan(3)
  const fastify = Fastify();
  fastify.register(require('../index'));
  fastify.get('/', (req, reply) => {
    reply.sqrly('nested/hello', {name: 'World'});
  });
  fastify.listen(0, err => {
    t.error(err);
    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.strictEqual(response.statusCode, 200);
      t.strictEqual(body.toString(), `<h1>Hello, World!</h1>`);
      fastify.close();
    });
  });
});

test('Debug and a query parameter of json=1 will send back the data as JSON', t => {
  t.plan(3)
  const fastify = Fastify();
  fastify.register(require('../index'),{debug: true});
  fastify.get('/', (req, reply) => {
    reply.sqrly('nested/hello', {name: 'World'});
  });
  fastify.listen(0, err => {
    t.error(err);
    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port + '?json=1'
    }, (err, response, body) => {
      t.strictEqual(response.statusCode, 200);
      t.deepEqual(JSON.parse(body), {"name": "World"});
      fastify.close();
    });
  });
});
