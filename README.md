[![npm version](https://badge.fury.io/js/fastify-squirrelly.svg)](https://badge.fury.io/js/fastify-squirrelly)

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

fastify.register(require('fastify-squirrelly'));

fastify.get('/', (req, reply) => {
  reply.sqrly('template-name', {data: ...});
});

fastify.listen(3000, err => {
  if(err) throw err;
});
```
<a name="options"></a>
### Options
  - `decorator` - change the decorator name. default `sqrly`
  - `autoEscape` - set autoEscaping on squirrelly. default `false`
  - `charset` - default utf-8
  - `templates` - directory templates are read from. default (__dirname, "/templates")
  - `partials` - directory partials are read from. default (__dirname, "/partials")
  - `helpers` - directory helpers are read from. default (__dirname, "/helpers")
  - `filters` - directory filters are read from. default (__dirname, "/filters")
  - `nativeHelpers` - directory nativeHelpers are read from. default (__dirname, "/nativeHelpers")
