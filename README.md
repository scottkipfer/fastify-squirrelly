# fastify-squirrelly
Plugin for rendering Squirrelly Templates

<a name="install"></a>
## Install
```
npm install fastify-squirrelly
```

<a name="usage"></a>
## Usage 
```js
const fastify = require('fastify')();

fastify.register(require('fastify-squirrelly'))

fastify.get('/', (req, reply) => {
  reply.sqrly('template-name', {data: ...});
});

fastify.listen(3000, err => {
  if(err) throw err;
});
```
