const fp = require("fastify-plugin");
const sqrly = require("squirrelly");
const path = require("path");
const klaw = require("klaw-sync");
const fs = require("fs");

function plugin(fastify, opts, next) {
  const cwd = path.dirname(process.mainModule.filename);
  const debug = opts.debug || false;
  const autoEscape = opts.autoEscape || false;
  const decorator = opts.decorator || "sqrly";
  const charset = opts.charset || "utf-8";
  const templateDirectory = opts.templates || path.join(cwd, "templates");
  const partialsDirectory = opts.partials || path.join(cwd, "partials");
  const helpersDirectory = opts.helpers || path.join(cwd, "helpers");
  const filtersDirectory = opts.filters || path.join(cwd, "filters");
  const nativeDirectory = opts.nativeHelpers || path.join(cwd, "nativeHelpers");

  function _import(dir, sqrlyMethod, importMethod) {
    const paths = fs.existsSync(dir) ? klaw(dir, { nodir: true }) : [];
    paths.forEach(({ path }) => {
      const file = importMethod(path);
      const importName = path.split(dir).join("").replace(/\.[^/.]+$/, "").replace(/^\//g, "");
      sqrlyMethod(importName, file);
    });
  }

  try {
    sqrly.autoEscaping(autoEscape);
    _import(partialsDirectory, sqrly.definePartial, fs.readFileSync);
    _import(helpersDirectory, sqrly.defineHelper, require);
    _import(filtersDirectory, sqrly.defineFilter, require);
    _import(nativeDirectory, sqrly.defineNativeHelper, require);
  } catch (e) {
    fastify.log.error(e);
    process.exit(1);
  }

  const getPage = page => `${templateDirectory}/${page}`;

  // Ends with .ext (but doesn't start with . (e.g. a hidden file)
  const hasExt = path => /^[^.]+\.[a-zA-Z0-9-]+$/.test(path);

  function renderer(template, data) {
    const json = this.request.query.json;
    if (json && debug) {
      this.send({data: data, locals: this.locals});
    } else {
      try {
        let page = path.isAbsolute(template) ? template : getPage(template);
        if (!hasExt(page)) page = `${ page }.html`;

        const view = sqrly.renderFile(page, {...this.locals, ...data});
        this.header("Content-Type", `text/html; charset=${charset}`);
        this.send(view);
      } catch(e) {
        fastify.log.error(e);
        this.send(new Error('Unable to render template. The template is either missing or invalid. ' + (debug ? e.stack : e)));
      }
    }
  }

  function locals(req, reply, done) {
    reply.locals = {};
    done();
  }

  fastify.addHook('onRequest', locals);
  fastify.decorateReply(decorator, function() {
    renderer.apply(this, arguments);
  });

  next();
}

module.exports = fp(plugin, { fastify: "^2.x" });
