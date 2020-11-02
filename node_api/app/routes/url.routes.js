module.exports = app => {
  const url = require("../controllers/url.controller.js");

  var router = require("express").Router();

  // Create a new URL
  router.post("/", url.create);

  // Retrieve all url stats
  router.get("/stats", url.findAllStats);

  // Retrieve a single URL with shortCode
  router.get("/:shortUrl", url.findOne);

  app.use(router);
  //app.use('/api/url', router);
};
