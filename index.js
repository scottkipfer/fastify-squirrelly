const fp = require("fastify-plugin");
const sqrly = require("squirrelly");
const path = require("path");
const klaw = require("klaw-sync");
const fs = require("fs");

function nuts(fastify, opts, next) {
  const decorator = opts.decorator || "sqrly";
  const charset = opts.charset || "utf-8";
  const templateDirectory =
    opts.templates || path.join(__dirname, "/templates");
  const partialsDirectory = opts.partials || path.join(__dirname, "/partials");
  const helpersDirectory = opts.partials || path.join(__dirname, "/helpers");

  const getPage = page => `${templateDirectory}/${page}.html`;

  function importPartials(dir) {
    const paths = klaw(dir, { nodir: true });
    paths.forEach(({ path }) => {
      const partial = fs.readFileSync(path);
      const partialName = path
        .split(dir)
        .join("")
        .replace(/\.[^/.]+$/, "")
        .replace(/^\//g, "");
      sqrly.definePartial(partialName, partial);
    });
  }

  function importHelpers(dir) {
    const paths = klaw(dir, { nodir: true });
    paths.forEach(({ path }) => {
      const helper = require(path);
      const helperName = path
        .split(dir)
        .join("")
        .replace(/\.[^/.]+$/, "")
        .replace(/^\//g, "");
      sqrly.defineHelper(helperName, helper);
    });
  }

  try {
    importPartials(partialsDirectory);
    importHelpers(helpersDirectory);
  } catch (e) {
    fastify.log.error(e);
    process.exit(1);
  }

  function renderer(path, data) {
    const page = getPage(path);
    const view = sqrly.renderFile(page, data);
    this.header("Content-Type", `text/html; charset=${charset}`);
    this.send(view);
  }

  fastify.decorateReply(decorator, function() {
    renderer.apply(this, arguments);
  });

  next();
}

module.exports = fp(nuts, { fastify: "^2.x" });
