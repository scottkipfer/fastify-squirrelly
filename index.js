const fp = require('fastify-plugin');
const sqrly = require('squirrelly');
const path =require('path');


function nuts(fastify, opts, next) {
  const charset = opts.charset || 'utf-8';
  const templateDirectory = opts.templates || path.join(__dirname, '/templates');

  const getPage = page => `${templateDirectory}/${page}`;

  function renderer(path, data) {
    const page = getPage(path);
    const view = sqrly.renderFile(page, data);
    this.header = ('Content-Type', `text/html; charset=${charset}`);
    this.send(view);
  }

  fastify.decorateReply('nuts', function() {
    renderer.apply(this, arguments);
  });

}

module.exports = fp(nuts, {fastify: '^2.x'});
