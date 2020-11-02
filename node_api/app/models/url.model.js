module.exports = (sequelize, Sequelize) => {
  const URL = sequelize.define("url", {
    urlCode: {
      type: Sequelize.STRING
    },
    longUrl: {
      type: Sequelize.TEXT
    },
    shortUrl: {
      type: Sequelize.STRING
    },
    clickCount: {
      type: Sequelize.STRING
    },
    ipAddress: {
      type: Sequelize.STRING
    },
    countryName: {
      type: Sequelize.STRING
    }
  },{});
  URL.associate = function(models) {
    URL.hasMany(models.CLICK, {as: 'CLICK',as: "clicks"})
  };
  return URL;
};
