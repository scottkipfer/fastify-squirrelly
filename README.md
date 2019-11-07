[![npm version](https://badge.fury.io/js/fastify-squirrelly.svg)](https://badge.fury.io/js/fastify-squirrelly)
[![Build Status](https://travis-ci.org/scottkipfer/fastify-squirrelly.svg?branch=master)](https://travis-ci.org/scottkipfer/fastify-squirrelly)

# fastify-squirrelly
Plugin for rendering Squirrelly Templates

<a name="requirements"></a>
## Requirements
```
node >= 6
fastify >= 2.0
```

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
  - `debug` - Allows you to see the template data as json. default `false`


## Examples

### Hello World Example

This example covers creating a squirrelly template that renders `Hello World!` and serving it from a fastify server. The completed example can be found in examples/hello-world

#### Install fastify and fastify-squirrelly
```
npm install fastify fastify-squirrelly
```

#### Create the Fastify server
```js
// server.js
const fastify = require('fastify')({logger: true});

fastify.register(require('fastify-squirrelly'));

fastify.get('/', (req, reply) => {
  reply.sqrly('hello', {name: 'World'});
});


fastify.listen(3000, err => {
  if(err) throw err;
});

```

#### Create the Squirrelly template file
create a folder called templates in the same directory as the server file.
Then create a file named hello.html in that folder.

|-- templates
    |-- hello.html
|-- server.js

```html
<!-- hello.html -->
<h1>Hello, {{name}}!</h1>

```

#### start the server!
```
node server.js
```

Open a browser and go to localhost:3000 and you should see `Hello, World!`.

Congrats! you just rendered your first template using fastify-squirrelly.
Try passing a value other than `'World'` and restart the server.
