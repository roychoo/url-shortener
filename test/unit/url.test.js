'use strict';

const {app, expect} = require('../common/helper');
const Url = app.models.Url;

describe('Url', function() {
  it('Url.find should return empty array', function() {
    return Url
      .find()
      .then(res => {
        expect(res).to.eql([]);
      });
  });
});
