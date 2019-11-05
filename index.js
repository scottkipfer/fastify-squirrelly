const fp = require("fastify-plugin");
const sqrly = require("squirrelly");
const path = require("path");
const klaw = require("klaw-sync");
const fs = require("fs");

function plugin(fastify, opts, next) {
  const autoEscape = opts.autoEscape || false;
  const decorator = opts.decorator || "sqrly";
  const charset = opts.charset || "utf-8";
  const templateDirectory = opts.templates || path.join(__dirname, "/templates");
  const partialsDirectory = opts.partials || path.join(__dirname, "/partials");
  const helpersDirectory = opts.helpers || path.join(__dirname, "/helpers");
  const filtersDirectory = opts.filters || path.join(__dirname, "/filters");
  const nativeDirectory = opts.native || path.join(__dirname, "/native");

  const getPage = page => `${templateDirectory}/${page}.html`;

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

  function renderer(path, data) {
    try {
      const page = getPage(path);
      const view = sqrly.renderFile(page, data);
      this.header("Content-Type", `text/html; charset=${charset}`);
      this.send(view);
    } catch(e) {
      fastify.log.error(e);
      throw new Error('Unable to render template. The template is either missing or invalid.');
    }
  }

  fastify.decorateReply(decorator, function() {
    renderer.apply(this, arguments);
  });

  next();
}

module.exports = fp(plugin, { fastify: "^2.x" });
