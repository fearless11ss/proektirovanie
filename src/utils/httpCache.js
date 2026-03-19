const crypto = require("crypto");

function buildWeakEtag(payload) {
  const json = JSON.stringify(payload);
  const hash = crypto.createHash("sha1").update(json).digest("base64");
  return `W/"${hash}"`;
}

function sendConditionalJson(req, res, payload, options = {}) {
  const maxAge = Number.isInteger(options.maxAge) ? options.maxAge : 20;
  const isPrivate = options.private !== false;
  const revalidate = options.revalidate !== false;
  const varyAuthorization = options.varyAuthorization !== false;

  const etag = buildWeakEtag(payload);
  const cacheParts = [isPrivate ? "private" : "public", `max-age=${maxAge}`];
  if (revalidate) {
    cacheParts.push("must-revalidate");
  }

  res.set("Cache-Control", cacheParts.join(", "));
  res.set("ETag", etag);
  if (varyAuthorization) {
    res.vary("Authorization");
  }

  const ifNoneMatch = req.headers["if-none-match"];
  if (ifNoneMatch && ifNoneMatch === etag) {
    return res.status(304).end();
  }

  return res.json(payload);
}

module.exports = {
  sendConditionalJson
};
