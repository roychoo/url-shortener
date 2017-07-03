'use strict';

const utils = require('loopback-datasource-juggler/lib/utils');
const shortid = require('shortid');
const request = require('request-promise');

module.exports = function(Url) {
  Url.observe('before save', function hashUrl(ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      const id = shortid.generate();
      ctx.instance.id = id;
    }
    next();
  });
  Url.redirect = function redirect(req, res, cb) {
    cb = cb || utils.createPromiseCallback();
    const keyword = req.params.keyword;
    const conditions = {
      where: {
        id: keyword,
      },
    };
    Url.findOne(conditions)
      .then((item) => {
        if (item) {
          item
            .logHit(req)
            .then(hit => {
              cb(null, item);
            });
          cb(null, item);
        } else {
          const err = new Error(`Keyword not found: ${keyword}`);
          cb(err);
        }
      }).catch(cb);
    return cb.promise;
  };

  Url.prototype.logHit = function logHit(req, cb) {
    cb = cb || utils.createPromiseCallback();
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const options = {
      method: 'GET',
      uri: 'http://freegeoip.net/json/' + ip,
      json: true
    };
    request(options)
      .then((response) => {
        const hit = {
          urlId: this.id,
          userAgent: req.headers['user-agent'],
          ip,
          country: response.country_code
        };
        return Url.app.models.Log.create(hit);
      })
      .then((hit) => cb(null, hit))
      .catch(cb);

    return cb.promise;
  }
};
