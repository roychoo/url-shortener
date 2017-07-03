'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.get('/:keyword', function keywordFn (req, res) {
    server.models.Url.redirect(req, res)
      .then((result) => {
        console.log(result);
        res.redirect(result.url);
      })
      .catch((err) => {
        console.log(err);
        res.redirect(`/not-found/${req.params.keyword}`)
      });
  });
  server.use(router);
};
