const fp = require('fastify-plugin');
const sqrly = require('squirrelly');
const path = require('path');
const klaw = require('klaw-sync');


function nuts(fastify, opts, next) {
  const charset = opts.charset || 'utf-8';
  const templateDirectory = opts.templates || path.join(__dirname, '/templates');
  const partialsDirectory = opts.partials || path.join(__dirname, 'examples/partials');
  const helpersDirectory = opts.partials || path.join(__dirname, '/helpers');

  const getPage = page => `${templateDirectory}/${page}`;


  const partials = klaw(partialsDirectory, {nodir: true});

  function renderer(path, data) {
    const page = getPage(path);
    const view = sqrly.renderFile(page, data);
    this.header = ('Content-Type', `text/html; charset=${charset}`);
    this.send(view);
  }

  fastify.decorateReply('nuts', function() {
    renderer.apply(this, arguments);
  });

  next();

}

module.exports = fp(nuts, {fastify: '^2.x'});
