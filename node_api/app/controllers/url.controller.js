const shortid = require("shortid");
const validUrl = require("valid-url");
const iplocate = require("node-iplocate");

const db = require("../models");

const URL = db.url;
const CLICK = db.click
const Op = db.Sequelize.Op;


// Create and Save a new URL
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.longUrl) {
    return res.status(400).json("URL content can not be empty!");
  }
  const longUrl = req.body.longUrl;
  const baseUrl = req.headers.host=='localhost:'+req.socket.localPort ? 'http://localhost:'+req.socket.localPort : req.headers.host;

  var ipAddress = req.ip == '::1' ? '127.0.0.1' : req.ip;
  var countryName = "";

  iplocate(ipAddress).then(function (results) { countryName = results.country; });
  //console.log("base url " + baseUrl + "   " + longUrl + "   IP   " + ipAddress + "   Country Name : " + countryName);

  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json("Internal error. Please come back later.");
  }

  const urlCode = shortid.generate();

  if (validUrl.isUri(longUrl)) {
    try {
      var tempUrl = await URL.findOne({ where: { 'longUrl': longUrl } });

      if (tempUrl !== null) {
        return res.status(200).json(tempUrl);
      } else {

        const shortUrl = baseUrl + "/" + urlCode;
        // Create a URL
        const url = {
          "longUrl": req.body.longUrl,
          "shortUrl": shortUrl,
          "urlCode": urlCode,
          "clickCount": "0",
          "ipAddress": ipAddress,
          "countryName": countryName
        };
        // Save URL in the database
        await URL.create(url).then(data => { return res.status(201).json(data); })
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).json("Internal Server error " + err.message);
    }
  } else {
    res.status(400).json("Invalid URL. Please enter a vlaid url for shortening.");
  }

};

// Find a single URL with an ShortURL
exports.findOne = async (req, res) => {
  const shortUrlCode = req.params.shortUrl;
  try {
    var tempUrl = await URL.findOne({ where: { 'urlCode': shortUrlCode } });
    if (tempUrl !== null) {
      var ipAddress = req.ip == '::1' ? '127.0.0.1' : req.ip;
      var countryName = "INDIA";
      iplocate(ipAddress).then(function (results) { countryName = results.country; });
      var clickCount = tempUrl.clickCount;
      // if (parseInt(clickCount) >= 50) {
      //   console.log("The click count for shortcode " + shortUrlCode + " has passed the limit of 50");
      //   return res.status(400).json("The click count for shortcode " + shortUrlCode + " has passed the limit of 50");
      // }
      clickCount++;
      const click = {
        "urlid": tempUrl.id,
        "ipAddress": ipAddress,
        "countryName": countryName
      };

      // Save Click in the databsase
      await CLICK.create(click)
      await URL.update({ "clickCount": clickCount.toString() }, { where: { 'urlCode': shortUrlCode } })
      return res.redirect(tempUrl.longUrl);
    } else {
      return res.status(400).json("The short url doesn't exists in our system.");
    }
  }
  catch (err) {
    console.error("Error while retrieving long url for shorturlcode " + shortUrlCode, err);
    return res.status(500).json("There is some internal error.");
  }
};

// find all URL Stats
exports.findAllStats = async (req, res) => {
  try {
    await URL.findAll({
      include: [{ model: db.click }]
    }).then(urls => {
      const resObj = urls.map(url => {
        return Object.assign({}, {
          longUrl: url.longUrl,
          shortUrl: url.shortUrl,
          clickCount: url.clickCount,
          clicks: url.clicks.map(click => {
            return Object.assign({}, {
              countryName: click.countryName
            })
          })
        })
      })
      res.status(201).json(resObj);
    })
  } catch (err) {
    res.status(500).json(
      "Some error occurred while retrieving URLs. " + err.message
    )
  }
};
